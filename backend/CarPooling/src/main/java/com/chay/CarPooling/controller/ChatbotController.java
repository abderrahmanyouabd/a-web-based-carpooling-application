package com.chay.CarPooling.controller;

import com.chay.CarPooling.service.SchemaService;
import com.chay.CarPooling.service.SqlExecutionService;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.InMemoryChatMemory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static com.chay.CarPooling.domain.QUERY.*;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */



@RestController
public class ChatbotController {



    private final ChatClient chatClient;
    private final SchemaService schemaService;
    private final SqlExecutionService sqlExecutionService;
    private static final String CHAT_ID = UUID.randomUUID().toString();
    private final InMemoryChatMemory chatMemory = new InMemoryChatMemory();


    public ChatbotController(SchemaService schemaService, ChatClient.Builder chatClientBuilder, SqlExecutionService sqlExecutionService) {
        this.schemaService = schemaService;
        this.sqlExecutionService = sqlExecutionService;
        this.chatClient = chatClientBuilder
                .defaultAdvisors(new MessageChatMemoryAdvisor(chatMemory)).defaultAdvisors(adv -> adv.param("chat_memory_conversation_id", CHAT_ID))
                .build();
    }

    @GetMapping("/stream")
    public Flux<String> chatWithStream(@RequestParam String message) {


        if (message == null || message.trim().isEmpty()) {
            return Flux.just("Error: Input message cannot be null or empty.");
        }


        String response = chatClient
                .prompt()
                .system(String.format(SQL_QUERY_PROMPT.getQuery(), SCHEMA.getQuery(), LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)))
                .user(message)
                .call()
                .content();

        if (response == null || response.trim().isEmpty()) {
            return Flux.just("Error: Failed to generate SQL query. No response from AI.");
        }

        System.out.println("Generated AI Response: " + response);

        String sqlQuery = extractSqlQuery(response);
        System.out.println("Extracted SQL Query: " + sqlQuery);

        if (sqlQuery == null || isModifyingQuery(sqlQuery)) {
            return chatClient
                    .prompt()
                    .user(message)
                    .system(DEFAULT_PROMPT.getQuery())
                    .stream()
                    .content();
        }


        String sqlResults = sqlExecutionService.executeSql(sqlQuery);
        System.out.println("SQL Execution Results: " + sqlResults);


        return chatClient
                .prompt()
                .system(String.format(REFINED_RESPONSE_PROMPT.getQuery(), sqlResults))
                .user(message)
                .stream()
                .content();
    }

    @GetMapping("/schema")
    public String getSchema(@RequestParam String tableName) {
        return schemaService.getSchemaAsString(tableName);
    }

    private String extractSqlQuery(String response) {
//        Pattern pattern = Pattern.compile("```sql\\n(.*?)```", Pattern.DOTALL);
        Pattern pattern = Pattern.compile("```[a-zA-Z]*\\n(.*?)```", Pattern.DOTALL);
        Matcher matcher = pattern.matcher(response);

        if (matcher.find()) {
            return matcher.group(1).trim();
        }
        return null;
    }


    private boolean isModifyingQuery(String sqlQuery) {
        if (sqlQuery == null || sqlQuery.isBlank()) {
            return false;
        }


        String modifyingKeywordsPattern = "\\b(INSERT|UPDATE|DELETE|MERGE|DROP|ALTER|TRUNCATE|RENAME|CREATE)\\b";


        Pattern pattern = Pattern.compile(modifyingKeywordsPattern, Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(sqlQuery.trim());

        return matcher.find();
    }


    @PostMapping("/stream/clear")
    public void clearMemory() {
        chatMemory.clear(CHAT_ID);
    }

}
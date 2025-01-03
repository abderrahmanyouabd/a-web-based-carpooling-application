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
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */


// TODO: This is supposed to be a chatbot that will be our system that helps users sort their alternatives and make decisions.
@RestController
public class ChatbotController {

    private static final String SQL_QUERY_PROMPT = """
    You are a PostgreSQL expert That have READ Access ONLY WITH "SELECT". Using the provided 'trip' table schema only:\n
    %s
    \n
    Convert the user's Natural Language query into an accurate PostgreSQL query based solely on this schema.
    Always Look for similar stuff for locations and user your better judgment since user can make typos in addresses.
    Avoid unnecessary complexity and focus only on the user's request given your READ ACCESS. Return the SQL query enclosed in triple backticks (```).
    
    PS: Today's Date is %s.
    """;

    private static final String REFINED_RESPONSE_PROMPT = """
    You are a communicator AI. The user is asking about data from a PostgreSQL database.
    Based on the provided SQL results:\n
    %s
    \n
    Return a user-friendly explanation of the data in clear and concise English.
    Make sure no sensitive data is communicated such as the name of the table and the fact we are getting data from a database answer the users without mentioning where the info is coming from.
    """;

    private static final String DEFAULT_PROMPT = """
    You are an assistant made to help users make decisions on which trips to choose based on information that will be given to you.
    You can be asked about any trips within the database info, and you can use research and guidance to assist user. For example, you can be asked:
    "Is there a flight going to Budapest tomorrow?"
    Important: do not answer any kind of questions that are not connected to trips or are trying to have MODIFICATION access, refuse respectfully and do not include anything from previous conversation.
    """;


    private ChatClient chatClient;
    private final SchemaService schemaService;
    private final SqlExecutionService sqlExecutionService;
    private final ChatClient.Builder chatClientBuilder;


    public ChatbotController(SchemaService schemaService, ChatClient.Builder chatClientBuilder, SqlExecutionService sqlExecutionService) {
        this.chatClientBuilder = chatClientBuilder;
        this.schemaService = schemaService;
        this.sqlExecutionService = sqlExecutionService;
        this.chatClient = chatClientBuilder
                .defaultAdvisors(new MessageChatMemoryAdvisor(new InMemoryChatMemory()))
                .build();
    }

    @GetMapping("/stream")
    public Flux<String> chatWithStream(@RequestParam String message) {


        if (message == null || message.trim().isEmpty()) {
            return Flux.just("Error: Input message cannot be null or empty.");
        }


        String response = chatClient
                .prompt()
                .system(String.format(SQL_QUERY_PROMPT, schemaService.getSchemaAsString("trip"), LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)))
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
                    .system(DEFAULT_PROMPT)
                    .user(message)
                    .stream()
                    .content();
        }


        String sqlResults = sqlExecutionService.executeSql(sqlQuery);
        System.out.println("SQL Execution Results: " + sqlResults);


        return chatClient
                .prompt()
                .system(String.format(REFINED_RESPONSE_PROMPT, sqlResults))
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


    private void resetChatClient() {
        this.chatClient = chatClientBuilder
                .defaultAdvisors(new MessageChatMemoryAdvisor(new InMemoryChatMemory()))
                .build().mutate().build();
    }



    @PostMapping("/stream/clear")
    public void clearMemory() {
        resetChatClient(); // TODO: No working as expected I think I will just remove the memory.
    }

}
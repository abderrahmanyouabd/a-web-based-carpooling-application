package com.chay.CarPooling.service.Impl;

import com.chay.CarPooling.repository.SchemaRepository;
import com.chay.CarPooling.service.SchemaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */
@Service
@RequiredArgsConstructor
public class SchemaServiceImpl implements SchemaService {
    private final SchemaRepository schemaRepository;

    @Override
    public String getSchemaAsString(String tableName) {
        List<String> schemaDetails = schemaRepository.getSchemaDetails(tableName);
        StringBuilder schemaString = new StringBuilder();

        schemaString.append("column_name | data_type | character_maximum_length | is_nullable\n");
        schemaString.append("-------------------------------------------------------------\n");

        for (String detail : schemaDetails) {
            schemaString.append(detail).append("\n");
        }

        return schemaString.toString();
    }
}

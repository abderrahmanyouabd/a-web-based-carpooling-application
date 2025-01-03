package com.chay.CarPooling.service.Impl;

import com.chay.CarPooling.service.SqlExecutionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */
@Service
@RequiredArgsConstructor
public class SqlExecutionServiceImpl implements SqlExecutionService {

    private final DataSource dataSource;


    @Override
    public String executeSql(String sqlQuery) {
        try (Connection connection = dataSource.getConnection();
             Statement statement = connection.createStatement();
             ResultSet resultSet = statement.executeQuery(sqlQuery)) {

            StringBuilder results = new StringBuilder();
            int columnCount = resultSet.getMetaData().getColumnCount();

            while (resultSet.next()) {
                for (int i = 1; i <= columnCount; i++) {
                    results.append(resultSet.getMetaData().getColumnName(i))
                            .append(": ")
                            .append(resultSet.getString(i))
                            .append(" | ");
                }
                results.append("\n");
            }
            if (results.toString().isBlank()){
                return "NO RESULTS";
            }
            return results.toString();

        } catch (Exception e) {
            return "Error executing SQL: " + e.getMessage();
        }
    }
}

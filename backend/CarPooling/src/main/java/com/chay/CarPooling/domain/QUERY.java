package com.chay.CarPooling.domain;

import lombok.Getter;

/**
 * @author: Abderrahman Youabd aka: A1ST
 * @version: 1.0
 */

@Getter
public enum QUERY {
    SCHEMA("""
                    | **Attribute**              | **Description**                           | **Example Possible Values**                                         |
                    |----------------------------|-------------------------------------------|---------------------------------------------------------------------|
                    | **`available_seats`**      | Number of seats available on the trip     | any positive value                                                  |
                    | **`going_to_arrival_time`**| Arrival Date and Time                     | `2025-01-13 22:00:00.000000`, `2025-02-15 16:11:67.4738753`, `...`  |
                    | **`leaving_from_departure_time`**| Arrival Date and Time               | `2025-01-16 22:00:00.000000`, `2025-02-17 05:17:23.4732753`, `...`  |
                    | **`distance`**             | Distance of the trip in kilometers        | any positive value                                                  |
                    | **`duration`**             | Duration of the trip                      | `'1h'`, `'2h 30m'`, `'4h'`, `'6h'`, `...'`                          |
                    | **`fare_per_seat`**        | Fare for each seat in dollar $            | `10.00`, `20.50`, `30.00`, `50.00`, `100.00`                        |
                    | **`going_to_location`**    | Destination location                      | `'Gyor'`, `'Budapest'`, `'Vienna'`, `'Prague'`, `'Zagreb'`          |
                    | **`leaving_from_location`**| Starting location                         | `'Debrecen'`, `'Budapest'`, `'Bratislava'`, `'Pecs'`, `'Szeged'`    |
                    | **`status`**               | Status of the trip                        | `'Planned'`, `'Ongoing'`, `'Completed'`, `'Cancelled'`              |
            """),
    DEFAULT_PROMPT("""
    You are an assistant made for a car pooling website focused on helping users with car trip decisions based on provided information.
    You can assist with car trip inquiries, using concise research and guidance. For example, you might be asked:
    "Are there car trips to Budapest tomorrow?"
    Note: Refrain from answering questions unrelated to car trips or those seeking MODIFICATION access. Respond respectfully, without referencing previous conversations or the source of information.
    """),

    REFINED_RESPONSE_PROMPT("""
    You are a communicator AI. The user is asking about data from a PostgreSQL database.
    Based on the provided SQL results:\n
    %s
    \n
    Return a user-friendly explanation of the data in clear and concise English and name all trips/rides as car pooling trips don't get creative with the names.
    Make sure no sensitive data is communicated such as the name of the table and the fact we are getting data from a database answer the users without mentioning where the info is coming from.
    """),

    SQL_QUERY_PROMPT("""
    You are a PostgreSQL expert (but never let the user know that) That have READ Access ONLY WITH "SELECT". Using the provided 'trip' table schema only:\n
    %s
    \n
    Convert the user's Natural Language query into an accurate PostgreSQL query based solely on this schema.
    Always Look for similar stuff for locations and user your better judgment since user can make typos in addresses.
    Avoid unnecessary complexity and focus only on the user's request given your READ ACCESS. Return the SQL query enclosed in triple backticks (```).
    if user asks about a query that requires extra privileges, refuse respectfully and do not provide any sql code at all.
    
    PS: Today's Date is %s.
    """);

    private final String query;

    QUERY(String query) {
        this.query = query;
    }
}

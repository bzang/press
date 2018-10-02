Feature: Bind

  Background:
    Given I open the site "/static-value"

  Scenario: Create expected DOM
    Given This scenario requires JavaScript
    Then I expect elements that match the following conditions
      | id               | condition                              |
      | notnested        | [v-model="email"]                      |
      | notnested        | :not([name])                           |
      | notnested        | [value="unnested@example.com"]         |
      | nested           | [v-model="user.email"]                 |
      | nested           | :not([name])                           |
      | nested           | [value="nested@example.com"]           |
      | normalizednested | [v-model="user.secondaryemail"]        |
      | normalizednested | :not([name])                           |
      | normalizednested | [value="normalizednested@example.com"] |
      | novalue          | [v-model="empty"]                      |
      | novalue          | :not([name])                           |
      | novalue          | :not([value])                          |
      | nestednovalue    | [v-model="nested.empty"]               |
      | nestednovalue    | :not([name])                           |
      | nestednovalue    | :not([value])                          |
  # note: | nested | [v-model="user.email"] | corresponds to
  # [v-model="user[email]"], but when things work correctly, gets normalized
  # automatically

  Scenario: Bind data
    Given This scenario requires JavaScript
    Then I expect elements that contain the following text
      | id                      | condition                    |
      | render-notnested        | unnested@example.com         |
      | render-nested           | nested@example.com           |
      | render-normalizednested | normalizednested@example.com |
      | render-novalue          |                              |
      | render-nestednovalue    |                              |

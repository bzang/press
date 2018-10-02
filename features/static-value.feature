Feature: Bind

  Background:
    Given I open the site "/static-value"

  Scenario: Create expected DOM
    Given This scenario requires JavaScript
    # Vue removes the v-model attribute from the DOM, so we can't test for it
    # directly
    Then I expect elements that match the following conditions
      | id               | condition                              |
      | notnested        | :not([name])                           |
      | notnested        | [value="unnested@example.com"]         |
      | nested           | :not([name])                           |
      | nested           | [value="nested@example.com"]           |
      | normalizednested | :not([name])                           |
      | normalizednested | [value="normalizednested@example.com"] |
      | novalue          | :not([name])                           |
      | novalue          | [value=""]                             |
      | nestednovalue    | :not([name])                           |
      | nestednovalue    | [value=""]                             |

  Scenario: Bind data
    Given This scenario requires JavaScript
    Then I expect elements that contain the following text
      | id                      | condition                    |
      | render-notnested        | unnested@example.com         |
      | render-nested           | nested@example.com           |
      | render-normalizednested | normalizednested@example.com |
      | render-novalue          |                              |
      | render-nestednovalue    |                              |

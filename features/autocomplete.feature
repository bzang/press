Feature: Autocomplete
  I want to upgrade text inputs with autocomplete capabilities

  Background:
    Given I open the site "/autocomplete"

  Scenario: Submit a search string
    When I set "example" to the inputfield "input[name='autocomplete[input]']"
    And I click on the element "input[name='autocomplete[input]']"
    And I press "Tab"
    And I click on the button "[type=submit]"
    Then I expect the server received a form parameter named "autocomplete.input" with a value of "example"

  Scenario: Submit a prefilled search string
    Given I open the site "/autocomplete?autocomplete[input]=prefilled"
    Then I expect that element "input[name='autocomplete[input]']" contains the text "prefilled"
    And I click on the button "[type=submit]"
    Then I expect the server received a form parameter named "autocomplete.input" with a value of "prefilled"

  Scenario: Change and submit a prefilled search string
    Given I open the site "/autocomplete?autocomplete[input]=prefilled"
    Then I expect that element "input[name='autocomplete[input]']" contains the text "prefilled"
    When I set "example" to the inputfield "input[name='autocomplete[input]']"
    And I press "Tab" in "input[name='autocomplete[input]']"
    And I click on the button "[type=submit]"
    Then I expect the server received a form parameter named "autocomplete.input" with a value of "example"

  Scenario: Type letters
    Given This scenario requires JavaScript
    When I add "a" to the inputfield "input[name='autocomplete[input]']"
    When I click on the element "input[name='autocomplete[input]']"
    Then I expect an autocomplete popup with "5" entries
    When I add "a" to the inputfield "input[name='autocomplete[input]']"
    When I click on the element "input[name='autocomplete[input]']"
    Then I expect an autocomplete popup with "4" entries
    When I add "a" to the inputfield "input[name='autocomplete[input]']"
    When I click on the element "input[name='autocomplete[input]']"
    Then I expect an autocomplete popup with "3" entries
    When I add "a" to the inputfield "input[name='autocomplete[input]']"
    When I click on the element "input[name='autocomplete[input]']"
    Then I expect an autocomplete popup with "2" entries
    When I add "a" to the inputfield "input[name='autocomplete[input]']"
    When I click on the element "input[name='autocomplete[input]']"
    Then I expect an autocomplete popup with "1" entries

  Scenario: Select autocomplete with mouse
    Given This scenario requires JavaScript
    When I add "a" to the inputfield "input[name='autocomplete[input]']"
    When I click on the element "input[name='autocomplete[input]']"
    Then I expect an autocomplete popup with "5" entries
    When I select the autocomplete option with the text "aaa"
    Then I expect that element "input[name='autocomplete[input]']" contains the text "aaa"
    And I click on the button "[type=submit]"
    Then I expect the server received a form parameter named "autocomplete.input" with a value of "aaa"

  Scenario: Select with mouse and submit with enter key
    Given This scenario requires JavaScript
    When I add "a" to the inputfield "input[name='autocomplete[input]']"
    When I click on the element "input[name='autocomplete[input]']"
    Then I expect an autocomplete popup with "5" entries
    When I select the autocomplete option with the text "aaa"
    Then I expect that element "input[name='autocomplete[input]']" contains the text "aaa"
    When I press "Enter"
    Then I expect the server received a form parameter named "autocomplete.input" with a value of "aaa"

  Scenario: Select autocomplete with keyboard
    Given This scenario requires JavaScript
    When I add "a" to the inputfield "input[name='autocomplete[input]']"
    When I click on the element "input[name='autocomplete[input]']"
    Then I expect an autocomplete popup with "5" entries
    When I press "Down"
    And I press "Down"
    And I press "Down"
    And I press "Enter"
    Then I expect that element "input[name='autocomplete[input]']" contains the text "aaa"
    When I click on the button "[type=submit]"
    Then I expect the server received a form parameter named "autocomplete.input" with a value of "aaa"

  Scenario: Select with enter and submit with enter key
    Given This scenario requires JavaScript
    When I add "a" to the inputfield "input[name='autocomplete[input]']"
    When I click on the element "input[name='autocomplete[input]']"
    Then I expect an autocomplete popup with "5" entries
    When I press "Down"
    And I press "Down"
    And I press "Down"
    # Safari does something subtly different depending on whether this is
    # "Enter" or "Return". Namely, "Enter" doesn't work
    And I press "Return"
    Then I expect that element "input[name='autocomplete[input]']" contains the text "aaa"
    Then I expect that element "#external-input" contains the text "aaa"
    When I press "Enter"
    Then I expect the server received a form parameter named "autocomplete.input" with a value of "aaa"

  Scenario: Change the model backing the text
    Given This scenario is pending
    Given This scenario requires JavaScript
    When I add "a" to the inputfield "input[name='autocomplete[input]']"
    When I click on the element "input[name='autocomplete[input]']"
    Then I expect an autocomplete popup with "5" entries
    When I set "aaaaa" to the inputfield "#external-input"
    When I click on the element "input[name='autocomplete[input]']"
    Then I expect an autocomplete popup with "1" entry
    When I click on the button "[type=submit]"
    Then I expect the server received a form parameter named "autocomplete.input" with a value of "aaaaa"

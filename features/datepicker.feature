Feature: Date Picker
  I want to upgrade date inputs with fancy date pickers

  Background:
    Given I open the site "/datepicker"

  Scenario: Submit a date
    When I add "2030-01-01" to the inputfield "input"
    And I click on the button "[type=submit]"
    Then I expect the server received a form parameter named "input" with a value of "2030-01-01"

  Scenario: Submit a date with fancy interactions
    Given This scenario requires JavaScript
    When I click on the element "[placeholder=input]"
    When I select day "1" of the month "January" of the year "2030"
    When I click on the button "[type=submit]"
    Then I expect the server received a form parameter named "input" with a value of "2030-01-01"

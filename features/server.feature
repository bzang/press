Feature: Test Server
  As an Engineer
  I want to write automation tests

  Scenario: Landing Page
    Given I open the site "/"
    Then I expect that the title is "PRESS Test Site"

  Scenario: Basic Input
    Given I open the site "/"
    Then I add "proof" to the inputfield "input"
    When I click on the button "[type=submit]"
    Then I expect the server received a form parameter named "input" with a value of "proof"

  Scenario: No JS
    Given I open the site "/javascript-mode"
    Then I expect that the title indicates if this browser supports JavaScript

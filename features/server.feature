Feature: Test Server
  As an Engineer
  I want to write automation tests

  Scenario: Landing Page
    Given I open the site "/"
    Then I expect that the title is "PRESS Test Site"

  Scenario: No JS
    Given I open the site "/javascript-mode"
    Then I expect that the title indicates if this browser supports JavaScript

Feature: HTML Forms
  As an engineer, I expect PRESS-enhanced forms to behave the same as regular HTML forms

  Background:
    Given I open the site "/form"

  Scenario: Checkbox with a value should be unchecked
    Then I expect that checkbox "#example_form_unchecked_checkbox" is not checked
    When I click on the element "[type=submit]"
    Then I expect the server received a form parameter named "example_form.unchecked_checkbox" with a value of ""0""

  Scenario: Checked checkbox with a value should be checked
    Then I expect that checkbox "#example_form_checked_checkbox" is checked
    When I click on the element "[type=submit]"
    Then I expect the server received a form parameter named "example_form.checked_checkbox" with a value of "["0", "1"]"

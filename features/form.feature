Feature: HTML Forms
  As an engineer, I expect PRESS-enhanced forms to behave the same as regular HTML forms

  Background:
    Given I open the site "/form"

  Scenario: Checkbox with a value should be unchecked
    Then I expect that checkbox "#example_form_unchecked_checkbox" is not checked
    When I click on the element "[type=submit]"
    Then I expect the server received a form parameter named "example_form.unchecked_checkbox" with a value of "\"0\""

  Scenario: Checked checkbox with a value should be checked
    Then I expect that checkbox "#example_form_checked_checkbox" is checked
    When I click on the element "[type=submit]"
    Then I expect the server received a form parameter named "example_form.checked_checkbox" with a value of "[\"0\", \"1\"]"

  Scenario: simple_form Radio Button Group
    Then I expect that element "#option_false" is selected
    And I expect that element "#option_true" is not selected
    When I click on the element "[type=submit]"
    # The array is little, but its what simple_form does to produce radio
    # buttons for some reason.
    Then I expect the server received a form parameter named "options" with a value of "[\"\", \"false\"]"
    And I expect that element "#option_false" is selected
    When I click on the element "[for=option_true]"
    Then I expect that element "#option_true" is selected
    When I click on the element "[type=submit]"
    Then I expect the server received a form parameter named "options" with a value of "[\"\", \"true\"]"

  Scenario: A prefilled text area
    When I submit a form using element "[type=submit]", I expect values in the following places
      | Value     | Element Before Submit           | Form After Submit |
      | prefilled | textarea[name='prefilled_text'] | prefilled_text    |
    When I set "altered" to the inputfield "textarea[name='prefilled_text']"
    When I submit a form using element "[type=submit]", I expect values in the following places
      | Value   | Element Before Submit           | Form After Submit |
      | altered | textarea[name='prefilled_text'] | prefilled_text    |

  Scenario: Button with name attribute
    Given This scenario requires JavaScript
    Then I expect that element "input[name=count]" contains the text "0"
    When I click on the button "#button-without-name"
    Then I expect that element "input[name=count]" contains the text "1"
    When I click on the button "#button-with-name"
    Then I expect that element "input[name=count]" contains the text "2"

  Scenario Outline: <Test Name>: Select Box behavior and Form Submission
    Given I open the site "<Path>"
    Then I expect that element "[name=<Input Name>]" contains the value "<Initial>"
    When I click on the element "[type=submit]"
    Then I expect the server received a form parameter named "<Input Name>" with a value of "\"<Initial>\""
    When I select the option with the text "One" for element "[name=<Input Name>]"
    Then I expect that element "[name=<Input Name>]" contains the value "1"
    When I select the option with the value "3" for element "[name=<Input Name>]"
    Then I expect that element "[name=<Input Name>]" contains the value "3"
    When I click on the button "[type=submit]"
    Then I expect the server received a form parameter named "<Input Name>" with a value of "\"3\""
    Examples:
      | Test Name                         | Input Name                 | Path                               | Initial |
      | No Placeholder/No Default Value   | select_without_placeholder | /form                              | 1       |
      | No Placeholder/Default Value is 2 | select_without_placeholder | /form?select_without_placeholder=2 | 2       |
      | Placeholder/No Default Value      | select_with_placeholder    | /form                              |         |
      | Placeholder/Default Value is 2    | select_with_placeholder    | /form?select_with_placeholder=2    | 2       |

  Scenario: required select with placeholder
    Given I open the site "/form?require-select_with_placeholder"
    And I expect that element "[name=select_with_placeholder][required]" does exist
    Then I expect that element "[name=select_with_placeholder]" contains the value ""
    And I expect that element ":invalid" does exist
    When I click on the element "[type=submit]"
    Then I expect that element ":invalid" does exist
    When I select the option with the value "3" for element "[name=select_with_placeholder]"
    Then I expect that element ":invalid" does not exist
    And I click on the element "[type=submit]"
    Then I expect the server received a form parameter named "select_with_placeholder" with a value of "\"3\""

  Scenario: required select without placeholder
    Given I open the site "/form?require-select_without_placeholder"
    And I expect that element "[name=select_without_placeholder][required]" does exist
    Then I expect that element "[name=select_without_placeholder]" contains the value "1"
    And I expect that element "form:invalid" does not exist
    When I click on the element "[type=submit]"
    Then I expect that element "form:invalid" does not exist
    And I expect the server received a form parameter named "select_without_placeholder" with a value of "\"1\""


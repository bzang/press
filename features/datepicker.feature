Feature: Date Picker
  I want to upgrade date inputs with fancy date pickers

  Background:
    Given I open the site "/datepicker"

  Scenario: Submit a date
    When I add "2022-01-01" to the inputfield "[name='date_picker_form[input]']"
    # need to click somewhere to unfocus the fancy datepicker
    And I click on the element "body"
    And I click on the button "[type=submit]"
    Then I expect the server received a form parameter named "date_picker_form.input" with a value of "2022-01-01"

  Scenario: The date is prepopulated by the server
    When I open the site "/datepicker" with inputfield "date_picker_form[input]" set to "2022-04-01"
    Then I expect that element "[name='date_picker_form[input]']" contains the text "2022-04-01"

  Scenario: Submit a start-of-month date with fancy interactions
    Given This scenario requires JavaScript
    When I click on the element "[data-press-datepicker-input]"
    And I select day "1" of the month "January" of the year "2022"
    Then I expect that element "[name='date_picker_form[input]']" contains the text "2022-01-01"
    Then I expect that element "[data-press-datepicker-input]" contains the text "01/01/2022"
    And I click on the button "[type=submit]"
    Then I expect the server received a form parameter named "date_picker_form[input]" with a value of "2022-01-01"

  Scenario: Submit a mid-month date with fancy interactions
    Given This scenario requires JavaScript
    When I click on the element "[data-press-datepicker-input]"
    And I select day "15" of the month "January" of the year "2022"
    Then I expect that element "[data-press-datepicker-input]" contains the text "01/15/2022"
    And I click on the button "[type=submit]"
    Then I expect the server received a form parameter named "date_picker_form[input]" with a value of "2022-01-15"

  Scenario: Submit an end-of-month date with fancy interactions
    Given This scenario requires JavaScript
    When I click on the element "[data-press-datepicker-input]"
    And I select day "31" of the month "January" of the year "2022"
    Then I expect that element "[data-press-datepicker-input]" contains the text "01/31/2022"
    And I click on the button "[type=submit]"
    Then I expect the server received a form parameter named "date_picker_form[input]" with a value of "2022-01-31"

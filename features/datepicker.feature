Feature: Date Picker
  I want to upgrade date inputs with fancy date pickers

  Background:
    Given I open the site "/datepicker"

  # Unfortunately, we need separate scenarios for JS and non-JS text input
  Scenario: Submit a date (js disabled)
    # The jquery date picker we're using only accepts locale-formatted dates
    Given This scenario prohibits JavaScript
    When I set "2019-01-01" to the inputfield "[name='date_picker_form[input]']:not([type=hidden]),[data-press-datepicker-input]"
    # need to click somewhere to unfocus the fancy datepicker
    And I click on the element "body"
    And I click on the button "[type=submit]"
    Then I expect the server received a form parameter named "date_picker_form.input" with a value of "2019-01-01"

  Scenario: Submit a date (js enabled)
    # And the HTML5 date input only accepts ISO date formatted dates
    Given This scenario requires JavaScript
    When I set "01/01/2019" to the inputfield "[name='date_picker_form[input]']:not([type=hidden]),[data-press-datepicker-input]"
    And I click on the element "body"
    And I click on the button "[type=submit]"
    Then I expect the server received a form parameter named "date_picker_form.input" with a value of "2019-01-01"

  Scenario: Submit the default range
    Given This scenario requires JavaScript
    When I click on the button "[type=submit]"
    Then I expect the server received a form parameter named "date_picker_form.input" with a value matching /\d{4}-\d{2}-\d{2}/

  Scenario: Change the date value externally
    Given This scenario requires JavaScript
    When I set "01/01/2019" to the inputfield "[data-press-datepicker-input]"
    Then I expect that element "#selected-value" contains the text "2019-01-01"
    And I expect that element "#external-input" contains the text "2019-01-01"
    When I set "2019-01-02" to the inputfield "#external-input"
    Then I expect that element "#selected-value" contains the text "2019-01-02"
    And I expect that element "#external-input" contains the text "2019-01-02"
    And I click on the button "[type=submit]"
    Then I expect the server received a form parameter named "date_picker_form.input" with a value of "2019-01-02"

  Scenario: The date is prepopulated by the server
    When I open the site "/datepicker" with inputfield "date_picker_form[input]" set to "2019-01-01"
    Then I expect that element "[name='date_picker_form[input]']" contains the text "2019-01-01"

  Scenario: Submit a start-of-month date with fancy interactions
    Given This scenario requires JavaScript
    When I click on the element "[data-press-datepicker-input]"
    And I select day "1" of the month "January" of the year "2019"
    Then I expect that element "[name='date_picker_form[input]']" contains the text "2019-01-01"
    And I expect that element "[data-press-datepicker-input]" contains the text "01/01/2019"
    And I expect that element "#selected-value" contains the text "2019-01-01"
    And I expect that element "#external-input" contains the text "2019-01-01"
    And I click on the button "[type=submit]"
    Then I expect the server received a form parameter named "date_picker_form.input" with a value of "2019-01-01"

  Scenario: Submit a mid-month date with fancy interactions
    Given This scenario requires JavaScript
    When I click on the element "[data-press-datepicker-input]"
    And I select day "15" of the month "January" of the year "2019"
    Then I expect that element "[data-press-datepicker-input]" contains the text "01/15/2019"
    And I expect that element "#selected-value" contains the text "2019-01-15"
    And I expect that element "#external-input" contains the text "2019-01-15"
    When I click on the button "[type=submit]"
    Then I expect the server received a form parameter named "date_picker_form.input" with a value of "2019-01-15"

  Scenario: Submit an end-of-month date with fancy interactions
    Given This scenario requires JavaScript
    When I click on the element "[data-press-datepicker-input]"
    And I select day "31" of the month "January" of the year "2019"
    Then I expect that element "[data-press-datepicker-input]" contains the text "01/31/2019"
    And I expect that element "#selected-value" contains the text "2019-01-31"
    And I expect that element "#external-input" contains the text "2019-01-31"
    And I click on the button "[type=submit]"
    Then I expect the server received a form parameter named "date_picker_form.input" with a value of "2019-01-31"

  Scenario: Pick a date, then pick a different date
    Given This scenario requires JavaScript
    When I click on the element "[data-press-datepicker-input]"
    And I select day "12" of the month "January" of the year "2019"
    And I expect that element "[data-press-datepicker-input]" contains the text "01/12/2019"
    And I click on the element "[data-press-datepicker-input]"
    And I select day "1" of the next month
    Then I expect that element "[data-press-datepicker-input]" contains the text "02/01/2019"
    And I click on the button "[type=submit]"
    Then I expect the server received a form parameter named "date_picker_form.input" with a value of "2019-02-01"

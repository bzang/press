Feature: Date Picker
  I want to upgrade date inputs with fancy date pickers

  Background:
    Given I open the site "/datepicker"

  # Unfortunately, we need separate scenarios for JS and non-JS text input
  Scenario: Submit a date (js disabled)
    # The jquery date picker we're using only accepts locale-formatted dates
    Given This scenario prohibits JavaScript
    When I set "January", "1" of next year to the date input "[name='date_picker_form[input]']:not([type=hidden]),[data-press-datepicker-input]"
    # need to click somewhere to unfocus the fancy datepicker
    And I click on the element "body"
    And I click on the button "[type=submit]"
    Then I expect the server received an iso date named "date_picker_form.input" of "January", "1" of next year

  Scenario: Submit a date (js enabled)
    # And the HTML5 date input only accepts ISO date formatted dates
    Given This scenario requires JavaScript
    When I set "January", "1" of next year to the text input "[name='date_picker_form[input]']:not([type=hidden]),[data-press-datepicker-input]"
    And I click on the element "body"
    And I click on the button "[type=submit]"
    Then I expect the server received an iso date named "date_picker_form.input" of "January", "1" of next year

  Scenario: Submit the default range
    Given This scenario requires JavaScript
    When I click on the button "[type=submit]"
    Then I expect the server received an iso date named "date_picker_form.input"

  Scenario: Change the date value externally
    Given This scenario requires JavaScript
    When I set "January", "1" of next year to the text input "[data-press-datepicker-input]"
    Then I expect that element "#selected-value" contains the iso date matching next year's "January", "1"
    And I expect that element "#external-input" contains the iso date matching next year's "January", "1"
    When I set "January", "2" of next year to the date input "#external-input"
    Then I expect that element "#selected-value" contains the iso date matching next year's "January", "2"
    And I expect that element "#external-input" contains the iso date matching next year's "January", "2"
    And I click on the button "[type=submit]"
    Then I expect the server received an iso date named "date_picker_form.input" of "January", "2" of next year

  Scenario: The date is prepopulated by the server
    When I open the site "/datepicker" with inputfield "date_picker_form[input]" set to "2019-01-01"
    Then I expect that element "[name='date_picker_form[input]']" contains the text "2019-01-01"

  Scenario: Submit a start-of-month date with fancy interactions
    Given This scenario requires JavaScript
    When I click on the element "[data-press-datepicker-input]"
    And I select day "1" of the month "January" of next year
    Then I expect that element "[name='date_picker_form[input]']" contains the iso date matching next year's "January", "1"
    And I expect that element "[data-press-datepicker-input]" contains the formatted date matching next year's "January", "1"
    And I expect that element "#selected-value" contains the iso date matching next year's "January", "1"
    And I expect that element "#external-input" contains the iso date matching next year's "January", "1"
    And I click on the button "[type=submit]"
    Then I expect the server received an iso date named "date_picker_form.input" of "January", "1" of next year

  Scenario: Submit a mid-month date with fancy interactions
    Given This scenario requires JavaScript
    When I click on the element "[data-press-datepicker-input]"
    And I select day "15" of the month "January" of next year
    Then I expect that element "[name='date_picker_form[input]']" contains the iso date matching next year's "January", "15"
    Then I expect that element "[data-press-datepicker-input]" contains the formatted date matching next year's "January", "15"
    And I expect that element "#selected-value" contains the iso date matching next year's "January", "15"
    And I expect that element "#external-input" contains the iso date matching next year's "January", "15"
    When I click on the button "[type=submit]"
    Then I expect the server received an iso date named "date_picker_form.input" of "January", "15" of next year

  Scenario: Submit an end-of-month date with fancy interactions
    Given This scenario requires JavaScript
    When I click on the element "[data-press-datepicker-input]"
    And I select day "31" of the month "January" of next year
    Then I expect that element "[name='date_picker_form[input]']" contains the iso date matching next year's "January", "31"
    Then I expect that element "[data-press-datepicker-input]" contains the formatted date matching next year's "January", "31"
    And I expect that element "#selected-value" contains the iso date matching next year's "January", "31"
    And I expect that element "#external-input" contains the iso date matching next year's "January", "31"
    And I click on the button "[type=submit]"
    Then I expect the server received an iso date named "date_picker_form.input" of "January", "31" of next year

  Scenario: Pick a date, then pick a different date
    Given This scenario requires JavaScript
    When I click on the element "[data-press-datepicker-input]"
    And I select day "12" of the month "January" of next year
    And I expect that element "[data-press-datepicker-input]" contains the formatted date matching next year's "January", "12"
    And I click on the element "[data-press-datepicker-input]"
    And I select day "1" of the next month
    Then I expect that element "[data-press-datepicker-input]" contains the formatted date matching next year's "February", "1"
    And I click on the button "[type=submit]"
    Then I expect the server received an iso date named "date_picker_form.input" of "February", "1" of next year


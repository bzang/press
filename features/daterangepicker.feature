Feature: Date Range Picker
  I want to upgrade date range inputs with fancy date range pickers

  Background:
    Given I open the site "/daterangepicker"

  Scenario: Submit a date range (js disabled)
    # The jquery date picker we're using only accepts locale-formatted dates
    Given This scenario prohibits JavaScript
    When I set "2019-03-01" to the inputfield "[name='date_rangepicker_form[start_date]']"
    And I set "2019-04-02" to the inputfield "[name='date_rangepicker_form[end_date]']"
    # need to click somewhere to unfocus the fancy datepicker
    And I click on the element "body"
    When I click on the button "[type=submit]"
    Then I expect the server received a form parameter named "date_rangepicker_form.start_date" with a value of "2019-03-01"
    And I expect the server received a form parameter named "date_rangepicker_form.end_date" with a value of "2019-04-02"

  Scenario: Submit a date range (js enabled)
    Given This scenario requires JavaScript
    When I click on the element "[data-press-daterangepicker-input]"
    And I select day "1" of the month "March" of the year "2019" and day "2" of the month "April" of the year "2019"
    Then I expect that element "[data-press-daterangepicker-input]" contains the text "03/01/2019 - 04/02/2019"
    And I expect that element "#external-input-start" contains the text "2019-03-01"
    And I expect that element "#external-input-end" contains the text "2019-04-02"
    When I click on the button "[type=submit]"
    Then I expect the server received a form parameter named "date_rangepicker_form.start_date" with a value of "2019-03-01"
    And I expect the server received a form parameter named "date_rangepicker_form.end_date" with a value of "2019-04-02"

  Scenario: Submit the default date range
    Given This scenario requires JavaScript
    And I open the site "/daterangepicker"
    When I click on the button "[type=submit]"
    Then I expect the server received a form parameter named "date_rangepicker_form.start_date" with a value matching /\d{4}-\d{2}-\d{2}/
    And I expect the server received a form parameter named "date_rangepicker_form.end_date" with a value matching /\d{4}-\d{2}-\d{2}/

  Scenario: Select and change a date range
    Given This scenario requires JavaScript
    When I click on the element "[data-press-daterangepicker-input]"
    And I select day "1" of the month "January" of the year "2019" and day "2" of the month "February" of the year "2019"
    And I click on the element "[data-press-daterangepicker-input]"
    And I select day "1" of the month "March" of the year "2019" and day "2" of the month "April" of the year "2019"
    Then I expect that element "[data-press-daterangepicker-input]" contains the text "03/01/2019 - 04/02/2019"
    And I expect that element "#external-input-start" contains the text "2019-03-01"
    And I expect that element "#external-input-end" contains the text "2019-04-02"
    When I click on the button "[type=submit]"
    Then I expect the server received a form parameter named "date_rangepicker_form.start_date" with a value of "2019-03-01"
    And I expect the server received a form parameter named "date_rangepicker_form.end_date" with a value of "2019-04-02"

  Scenario: Submit a prefilled date range
    Given This scenario requires JavaScript
    And I open the site "/daterangepicker?date_rangepicker_form[start_date]=2019-01-01&date_rangepicker_form[end_date]=2019-02-01"
    Then I expect that element "[data-press-daterangepicker-input]" contains the text "01/01/2019 - 02/01/2019"
    And I expect that element "#external-input-start" contains the text "2019-01-01"
    And I expect that element "#external-input-end" contains the text "2019-02-01"
    When I click on the button "[type=submit]"
    Then I expect the server received a form parameter named "date_rangepicker_form.start_date" with a value of "2019-01-01"
    And I expect the server received a form parameter named "date_rangepicker_form.end_date" with a value of "2019-02-01"

  Scenario: Change and submit a prefilled date range
    Given This scenario requires JavaScript
    And I open the site "/daterangepicker?date_rangepicker_form[start_date]=2019-01-01&date_rangepicker_form[end_date]=2019-02-01"
    When I click on the element "[data-press-daterangepicker-input]"
    And I select day "1" of the month "March" of the year "2019" and day "2" of the month "April" of the year "2019"
    Then I expect that element "[data-press-daterangepicker-input]" contains the text "03/01/2019 - 04/02/2019"
    And I expect that element "#external-input-start" contains the text "2019-03-01"
    And I expect that element "#external-input-end" contains the text "2019-04-02"
    And I click on the button "[type=submit]"
    Then I expect the server received a form parameter named "date_rangepicker_form.start_date" with a value of "2019-03-01"
    And I expect the server received a form parameter named "date_rangepicker_form.end_date" with a value of "2019-04-02"

  Scenario: Change the model backing a date range
    Given This scenario requires JavaScript
    When I click on the element "[data-press-daterangepicker-input]"
    And I select day "1" of the month "March" of the year "2019" and day "2" of the month "April" of the year "2019"
    Then I expect that element "[data-press-daterangepicker-input]" contains the text "03/01/2019 - 04/02/2019"
    And I expect that element "#external-input-start" contains the text "2019-03-01"
    And I expect that element "#external-input-end" contains the text "2019-04-02"
    When I set "2019-01-02" to the inputfield "#external-input-start"
    When I set "2019-01-03" to the inputfield "#external-input-end"
    When I click on the button "[type=submit]"
    Then I expect the server received a form parameter named "date_rangepicker_form.start_date" with a value of "2019-01-02"
    And I expect the server received a form parameter named "date_rangepicker_form.end_date" with a value of "2019-01-03"

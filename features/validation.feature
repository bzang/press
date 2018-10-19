Feature: Validation Errors
  As an Engineer
  I want custom form components to produce validation errors like normal form components

  Scenario Outline: <component> replicates HTML 5 form validation
    Given I open the site "/validation"
    When I click on the element ".//button[text() = '<component>']"
    And I expect that element "#<component>-section input:invalid" does exist

    Examples:
      | component    |
      | autocomplete |
  # datepicker and daterangepicker don't support null values, so therefore
  # can't failed a `required` check

  Scenario Outline: <component> replicates server-side Semantic UI form validation
    Given I open the site "/validation"
    Then I expect that element "#<component>-section-with-errors .field.required.error" does exist
    And I expect that element "#<component>-section-with-errors .ui.error.input" does exist

    Examples:
      | component       |
      | autocomplete    |
      | datepicker      |
      | daterangepicker |

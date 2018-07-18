Feature: Simple Form Support
  As a Ruby on Rails Engineer
  I want to use PRESS to augment SimpleForm forms

  Background:
    Given I open the site "/simpleform"

  Scenario: Nested field names
    When I set "proof" to the inputfield "[name='simple_form[text]']"
    And I select the option with the text "B" for element "[name='simple_form[select]']"
    And I click on the button "[type=submit]"
    Then I expect the server received a form parameter named "simple_form.text" with a value of "proof"
    And I expect the server received a form parameter named "simple_form.select" with a value of "1"

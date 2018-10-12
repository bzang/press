Feature: Autocomplete
  I want to upgrade text inputs with autocomplete capabilities

  Background:
    Given I open the site "/autocomplete"

  Scenario: Submit a search string
    When I set "example" to the inputfield "input[name='autocomplete[input]']"
    And I click on the element "input[name='autocomplete[input]']"
    And I press "Tab"
    When I submit a form using element "[type=submit]", I expect values in the following places
      | Value   | Element Before Submit             | Form After Submit  |
      | example | input[name='autocomplete[input]'] | autocomplete.input |

  Scenario: Submit a prefilled search string
    Given I open the site "/autocomplete?autocomplete[input]=prefilled"
    Then I expect that element "input[name='autocomplete[input]']" contains the text "prefilled"
    When I submit a form using element "[type=submit]", I expect values in the following places
      | Value     | Element Before Submit             | Form After Submit  |
      | prefilled | input[name='autocomplete[input]'] | autocomplete.input |

  Scenario: Change and submit a prefilled search string
    Given I open the site "/autocomplete?autocomplete[input]=prefilled"
    Then I expect that element "input[name='autocomplete[input]']" contains the text "prefilled"
    When I set "example" to the inputfield "input[name='autocomplete[input]']"
    And I press "Tab" in "input[name='autocomplete[input]']"
    And I submit a form using element "[type=submit]", I expect values in the following places
      | Value   | Element Before Submit             | Form After Submit  |
      | example | input[name='autocomplete[input]'] | autocomplete.input |

  Scenario: Type letters
    Given This scenario requires JavaScript
    When I add "a" to the inputfield "input[name='autocomplete[input]']"
    When I click on the element "input[name='autocomplete[input]']"
    Then I expect an autocomplete popup with "5" entries
    When I add "a" to the inputfield "input[name='autocomplete[input]']"
    When I click on the element "input[name='autocomplete[input]']"
    Then I expect an autocomplete popup with "4" entries
    When I add "a" to the inputfield "input[name='autocomplete[input]']"
    When I click on the element "input[name='autocomplete[input]']"
    Then I expect an autocomplete popup with "3" entries
    When I add "a" to the inputfield "input[name='autocomplete[input]']"
    When I click on the element "input[name='autocomplete[input]']"
    Then I expect an autocomplete popup with "2" entries
    When I add "a" to the inputfield "input[name='autocomplete[input]']"
    When I click on the element "input[name='autocomplete[input]']"
    Then I expect an autocomplete popup with "1" entries

  Scenario: Select with mouse and submit with mouse
    Given This scenario requires JavaScript
    When I add "a" to the inputfield "input[name='autocomplete[input]']"
    When I click on the element "input[name='autocomplete[input]']"
    Then I expect an autocomplete popup with "5" entries
    When I select the autocomplete option with the text "aaa"
    And I submit a form using element "[type=submit]", I expect values in the following places
      | Value | Element Before Submit             | Form After Submit  |
      | aaa   | input[name='autocomplete[input]'] | autocomplete.input |
      | aaa   | #external-input                   | autocomplete.input |

  Scenario: Select with mouse and submit with keyboard
    Given This scenario requires JavaScript
    When I add "a" to the inputfield "input[name='autocomplete[input]']"
    When I click on the element "input[name='autocomplete[input]']"
    Then I expect an autocomplete popup with "5" entries
    And I select the autocomplete option with the text "aaa"
    When I submit a form using the "Enter" key, I expect values in the following places
      | Value | Element Before Submit             | Form After Submit  |
      | aaa   | input[name='autocomplete[input]'] | autocomplete.input |
      | aaa   | #external-input                   | autocomplete.input |


  Scenario: Select with keyboard and submit with keyboard
    Given This scenario requires JavaScript
    When I add "a" to the inputfield "input[name='autocomplete[input]']"
    When I click on the element "input[name='autocomplete[input]']"
    Then I expect an autocomplete popup with "5" entries
    When I press "Down"
    And I press "Down"
    And I press "Down"
    # Safari does something subtly different depending on whether this is
    # "Enter" or "Return". Namely, "Enter" doesn't work
    And I press "Return"
    And I submit a form using the "Return" key, I expect values in the following places
      | Value | Element Before Submit             | Form After Submit  |
      | aaa   | input[name='autocomplete[input]'] | autocomplete.input |
      | aaa   | #external-input                   | autocomplete.input |

  Scenario: Change the model backing the text
    Given This scenario is pending
    Given This scenario requires JavaScript
    When I add "a" to the inputfield "input[name='autocomplete[input]']"
    When I click on the element "input[name='autocomplete[input]']"
    Then I expect an autocomplete popup with "5" entries
    When I set "aaaaa" to the inputfield "#external-input"
    When I click on the element "input[name='autocomplete[input]']"
    Then I expect an autocomplete popup with "1" entry
    When I submit a form using element "[type=submit]", I expect values in the following places
      | Value | Element Before Submit             | Form After Submit  |
      | aaaaa | input[name='autocomplete[input]'] | autocomplete.input |
      | aaaaa | #external-input                   | autocomplete.input |

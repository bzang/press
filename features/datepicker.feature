Feature: Date Picker
  I want to upgrade date inputs with fancy date pickers

  # Unfortunately, we need separate scenarios for JS and non-JS text input
  Scenario Outline: <mode>: Submit a date (js disabled)
    Given This scenario prohibits JavaScript
    Given I open the site "/datepicker_<mode>"
    When I set "January", "1" of next year to the date input "input[placeholder='Enter a date']"
    # need to click somewhere to unfocus the fancy datepicker
    And I click on the element "body"
    When I submit a form using element "[type=submit]", I expect next year's dates to be represented in the following places
      | Month   | Date | Element Before Submit            | Form After Submit      |
      | January | 1    | [name='date_picker_form[input]'] | date_picker_form.input |

    Examples:
      | mode           |
      | inferrence     |
      | custom-element |

  Scenario Outline: <mode>: Submit a date (js enabled)
    # And the HTML5 date input only accepts ISO date formatted dates
    Given This scenario requires JavaScript
    Given I open the site "/datepicker_<mode>"
    When I set "January", "1" of next year to the text input "input[placeholder='Enter a date']"
    And I click on the element "body"
    Then I expect that element "#external-input" contains the iso date matching next year's "January", "1"
    When I submit a form using element "[type=submit]", I expect next year's dates to be represented in the following places
      | Month   | Date | Element Before Submit            | Form After Submit      |
      | January | 1    | [name='date_picker_form[input]'] | date_picker_form.input |

    Examples:
      | mode           |
      | inferrence     |
      | custom-element |

  Scenario Outline: <mode>: Submit the default date
    Given This scenario requires JavaScript
    Given I open the site "/datepicker_<mode>"
    When I click on the button "[type=submit]"
    Then I expect the server received an iso date named "date_picker_form.input"

    Examples:
      | mode           |
      | inferrence     |
      | custom-element |

  Scenario Outline: <mode>: Change the date value externally
    Given This scenario requires JavaScript
    Given I open the site "/datepicker_<mode>"
    When I set "January", "1" of next year to the text input "input[placeholder='Enter a date']"
    Then I expect that element "#selected-value" contains the iso date matching next year's "January", "1"
    And I expect that element "#external-input" contains the iso date matching next year's "January", "1"
    And I expect that element "[name='date_picker_form[input]']" contains the iso date matching next year's "January", "1"
    When I set "January", "2" of next year to the date input "#external-input"
    Then I expect that element "#selected-value" contains the iso date matching next year's "January", "2"
    And I expect that element "#external-input" contains the iso date matching next year's "January", "2"
    When I submit a form using element "[type=submit]", I expect next year's dates to be represented in the following places
      | Month   | Date | Element Before Submit            | Form After Submit      |
      | January | 2    | [name='date_picker_form[input]'] | date_picker_form.input |

    Examples:
      | mode           |
      | inferrence     |
      | custom-element |

  Scenario Outline: <mode>: The date is prepopulated by the server
    Given I open the site "/datepicker_<mode>" with inputfield "date_picker_form[input]" set to "2019-01-01"
    Then I expect that element "[name='date_picker_form[input]']" contains the text "2019-01-01"

    Examples:
      | mode           |
      | inferrence     |
      | custom-element |

  Scenario Outline: <mode>: Submit a start-of-month date with fancy interactions
    Given This scenario requires JavaScript
    Given I open the site "/datepicker_<mode>"
    When I click on the element "input[placeholder='Enter a date']"
    And I select day "1" of the month "January" of next year
    Then I expect that element "[name='date_picker_form[input]']" contains the iso date matching next year's "January", "1"
    And I expect that element "input[placeholder='Enter a date']" contains the formatted date matching next year's "January", "1"
    And I expect that element "#selected-value" contains the iso date matching next year's "January", "1"
    And I expect that element "#external-input" contains the iso date matching next year's "January", "1"
    When I submit a form using element "[type=submit]", I expect next year's dates to be represented in the following places
      | Month   | Date | Element Before Submit            | Form After Submit      |
      | January | 1    | [name='date_picker_form[input]'] | date_picker_form.input |

    Examples:
      | mode           |
      | inferrence     |
      | custom-element |

  Scenario Outline: <mode>: Submit a mid-month date with fancy interactions
    Given This scenario requires JavaScript
    Given I open the site "/datepicker_<mode>"
    When I click on the element "input[placeholder='Enter a date']"
    And I select day "15" of the month "January" of next year
    Then I expect that element "[name='date_picker_form[input]']" contains the iso date matching next year's "January", "15"
    Then I expect that element "input[placeholder='Enter a date']" contains the formatted date matching next year's "January", "15"
    And I expect that element "#selected-value" contains the iso date matching next year's "January", "15"
    And I expect that element "#external-input" contains the iso date matching next year's "January", "15"
    When I submit a form using element "[type=submit]", I expect next year's dates to be represented in the following places
      | Month   | Date | Element Before Submit            | Form After Submit      |
      | January | 15   | [name='date_picker_form[input]'] | date_picker_form.input |

    Examples:
      | mode           |
      | inferrence     |
      | custom-element |

  Scenario Outline: <mode>: Submit an end-of-month date with fancy interactions
    Given This scenario requires JavaScript
    Given I open the site "/datepicker_<mode>"
    When I click on the element "input[placeholder='Enter a date']"
    And I select day "31" of the month "January" of next year
    Then I expect that element "[name='date_picker_form[input]']" contains the iso date matching next year's "January", "31"
    Then I expect that element "input[placeholder='Enter a date']" contains the formatted date matching next year's "January", "31"
    And I expect that element "#selected-value" contains the iso date matching next year's "January", "31"
    And I expect that element "#external-input" contains the iso date matching next year's "January", "31"
    When I submit a form using element "[type=submit]", I expect next year's dates to be represented in the following places
      | Month   | Date | Element Before Submit            | Form After Submit      |
      | January | 31   | [name='date_picker_form[input]'] | date_picker_form.input |

    Examples:
      | mode           |
      | inferrence     |
      | custom-element |

  Scenario Outline: <mode>: Pick a date, then pick a different date
    Given This scenario requires JavaScript
    Given I open the site "/datepicker_<mode>"
    When I click on the element "input[placeholder='Enter a date']"
    And I select day "12" of the month "January" of next year
    And I expect that element "input[placeholder='Enter a date']" contains the formatted date matching next year's "January", "12"
    And I click on the element "input[placeholder='Enter a date']"
    And I select day "1" of the next month
    When I submit a form using element "[type=submit]", I expect next year's dates to be represented in the following places
      | Month    | Date | Element Before Submit            | Form After Submit      |
      | February | 1    | [name='date_picker_form[input]'] | date_picker_form.input |

    Examples:
      | mode           |
      | inferrence     |
      | custom-element |

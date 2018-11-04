---
title: Testing
---

# Testing

## Overview

Any new and updated code should be accompanied by the appropriate tests both in Python and/or JavaScript. There should also be a continuous effort to improve coverage of untested, old code.

### Philosophy

When writing tests, try to cover all cases in which the code you are testing can be used. Think of corner cases, like empty lists/arrays, missing fields in dictionaries, zero values (e.g. in division) and anything else that could potentially break your code. When writing tests, our goal should be to try and break the code we are testing against, not to create tests that are going to pass.

### Code quality

Like any other type of code, make the tests easy to understand and modify, so that other people (or yourself) can work on them in the future. Follow the standard guidelines regarding class/method documentation and comments, so that it is obvious what each test, setup and teardown does.

### Coverage

Code coverage is measured automatically using codecov.io and coverage changes are reported directly on github pull request pages. You should always aim for positive coverage changes.

There are certain repositories where the code coverage is 100%. On these repositories, the coverage must remain full, otherwise the build will fail on CircleCI.

In any case, each PR is expected to have a 100% diff coverage. You can use the data found in Codecove Report inside a pull request to see what is the diff coverage and what parts of the introduced changes remain to be covered.

### Bugs

When fixing a bug, you are presumably writing or modifying at least one test case. The existence of the bug means that the test case didn’t actually test the required functionality properly. It is important however to validate that your test fix is actually a fix itself. Although this is theoretically just a part of your bugfix, you need to test it as a separate change. And since we do not have a test-suite for our test-suite (how meta) we need to test this manually.

Here’s how:
1. Check out the mainline branch (e.g. `devel`) which contains the buggy code, i.e. make sure your bug fix is not applied.
2. Cherry-pick only the testing fixes.
3. Run the test case and verify that it fails.
4. Optionally, run the whole test suite and verify that only your test case fails.

## Python

### Directory structure

Python tests live under the `/tests` folder. Tests are split into logical groups based on Django applications. For each application there is separate folder in the form of `test_<application>`.

For example:

```
txc/transifex/
├── accounts
├── api
├── editor
└── tm

txc/tests/
├── test_accounts
├── test_api
├── test_editor
└── test_tm
```

### Test cases base class

When writing tests that interact with the database or Django's cache framework, have your test case class inherit from the base classes defined in the `txdata.tests.testcases` module.

This is an example of a test case with class level initialization:

```
from txdata.tests.testcases import TestCase

class MyTestCase(TestCase):

    @classmethod
    def setUpTestData(cls):
        super(MyTestCase, cls).setUpTestData()
        cls._project1 = ProjectFactory.create(id=1)
    ....
```

## JavaScript

### Directory structure

JavaScript tests live under the `/tests_js` folder. Tests are split into logical groups based on Django applications. For each application there is separate folder in the form of `test_<application>`.

For example:

```
txc/transifex/
├── accounts
├── api
├── editor
└── tm

txc/tests_js/
├── test_accounts
├── test_api
├── test_editor
└── test_tm
```

### Known limitations

When testing client side JavaScript (e.g. a Marionette application), the HTML
templates are served by Django, which creates an incompatibility with Karma.

As a team we need to figure out a solution to be able to test Django rendered HTML with JavaScript unit testing.

---
title: Coding best practices
---

# Coding best practices

This section contains generic guidelines that apply to all code we write, irrespective of the language. They are high-level principles that have to do with our mentality when writing code, not specific technical details.

We all spend much more time reading code, compared to writing it. The code we write will probably be revisited by ourselves or by other team members many times in the future, after many weeks, months or years. We should do our best to make it as easy as possible for any future reader or author to *understand, debug, modify, extend* and *test* our code.

Therefore, the main goal of all the following points is *clarity*.

## Naming

*Variables, functions, classes* and *methods* should be named in a way that their purpose is clear. Well-defined names can be of immense help to people that are skimming through a piece of code, so that they don’t have to keep jumping to the actual definitions (e.g. of classes or methods) all the time.

Pay extra attention to misleading names, i.e. cases where a member’s name represents something other than its actual content, meaning or purpose.

## Documentation

It should go without saying that all our code should be well-documented. There are no hard rules for exactly what parts of the code should be documented and to what extend. Common sense should be our guide here.

Just consider how the code will look to someone that will need to work on it 2 years from now, and add all documentation that you believe is necessary.

Language-specific guidelines may be detailed later in the document.

## Comments

Commenting is also a significant tool we have for providing inline help to anyone that is trying to make sense of our code.

Again, there are no hard rules regarding frequency and extent of use. Write as many as necessary so that people with reasonable familiarity of the code can understand what is going on. If you see that you have too many or too long comments, consider refactoring instead.

Some special cases that usually warrant comments are: hacks & workarounds, algorithms, multiple steps in long functions, variables with complex structure.

## Improving existing code

In case you are working on existing code that is hard to understand, by the time you are done you’ll have gained important knowledge. Take some extra time to make this part of the code clearer, by adding or improving documentation and comments, or renaming important variables, methods, and so on. For the sake of easier reviewing, it is considered a good practice that changes are encapsulated either on a different branch or at a least a different commit.

## Refactoring

When requirements change or the initial approach shows it’s limits, it could be time to refactor our code. However this should not be done lightly, and can often create more problems than it solves. Of particular danger is refactoring that requires changes in multiple modules or files at the same time. Here are some recommendations to follow to avoid problems.

Before beginning the process:

1. Get an idea of how the code is used by reviewing other parts of the codebase that depend on it.
2. Review our test suite and consider improving or adding related test cases so that you can validate that the existing functionality remains unchanged.
3. Identify the black-box tests that exist for the code, or consider building them if they don’t exist. *These tests should not be altered during the refactoring process.*
4. Run the test-suite to validate your environment is correctly set up for running all the relevant tests. This allows you later to detect test cases that make assumptions about the implementation that may have to change during refactoring.
5. Make a plan, estimate the necessary work to achieve the desired result and if you have enough time to finish the refactoring.

During refactoring:

1. Run any related black-box tests and/or unit tests while you make changes, and at least once after every commit.
2. Try to organise your changes into separate logical commits that you and your colleagues can review more easily.
3. Pay attention to the names of existing variables or methods so that they still make sense after refactoring. Make sure that you update them, so it is easier for future readers to understand the code.
4. Update any documentation and comments that no longer reflect reality.

----

[1] https://en.wikipedia.org/wiki/Black-box_testing

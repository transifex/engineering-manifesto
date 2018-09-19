# Github guide

## Basics

Familiarize yourself with git, learn how it works, understand it.

Some resources to help you get started (though you can find plenty on the internet):

- Interactive git tutorial: https://try.github.io/
- Git cheat sheet: https://services.github.com/on-demand/downloads/github-git-cheat-sheet.pdf

## Authentication

### Setup SSH github authentication

For security reasons we never use HTTPS authentication with git. So make sure you have setup SSH based authentication by following the github guide on your account: https://help.github.com/articles/connecting-to-github-with-ssh/

**NOT LIKE THIS**

`git clone https://github.com/transifex/repo.git`

**LIKE THIS**

`git clone git@github.com:transifex/repo.git`

### Setup github two-factor authentication

Go to https://github.com/settings/security and enable “Two-factor authentication”.

This is a requirement in order to be able to work within Transifex github organization.

## Working on a feature

In Transifex we follow some simple rules concerning branches:
- `master` is the branch that IS live on production servers
- `devel` is the “stable” branch that WILL go to production on next deploy

Thus, no-one messes with `master`, this is updated automatically through “releases” done by a deployment script.

No-one pushes directly on `devel`, we just open pull-requests on github and we merge them on devel after they meet certain quality criteria.

To work on a new feature (or fix a bug), you create a new branch on top of `devel` with a JIRA ticket as prefix.

For example:

```
git checkout devel
git pull origin devel
git checkout -b TX-8739-fix-crashing-homepage
...
```

### Authoring commits

When creating commits, either git on the command line, or using some GUI frontend, you should keep some things in mind. Your commit will always be available in the history, and will be read by other people months or years from now. Try to imagine yourself reading the commit history of a project that started 3 years ago. The following important points should be kept in mind when committing, so that:

1. Commits are correct and do not break the build (including style-checks such as PEP-8),
2. They have a single purpose, described in the commit message subject line,
3. And they should make sense to someone with the minimum required background information.

The first point can be addressed sufficiently by configuring your development environment (e.g. your editor) to check for style and syntax errors automatically (see previous sections), by testing your commit before pushing your code (at minimum the related parts of the test-suite should pass).

The second point means splitting unrelated changes into separate commits and generally try your best so that your commit can be reviewed as-is.

Last, make sure you add a commit message and that you try your best to describe what your commit is doing. Here are the rules you should follow when writing a commit message:

1. The first line should be the subject line:
    - It should summarize the changes that occur after applying the patch.
    - It should be no more than 50 characters
    - It should begin with a capital letter, and should *not* have a period at the end.
    - It should be able to fill in the blank: “When this commit is merged, it will ____”. E.g. “Fix the bug with project creation”.
2. The rest of the commit message body should be separated from the first line with a blank line, and it should be no more than 72 characters long. It should explain:
    - Why the change was necessary
    - What are the effects of the change
    - How the change creates those effects
3. Optionally, if you have a reference to another related commit, pull-request or JIRA ticket include it in the body.

Here’s an example of a [good commit message](https://github.com/bitcoin/bitcoin/commit/eb0b56b19017ab5c16c745e6da39c53126924ed6).

### Using pre-commit hooks

One easy way to check for various issues in your commits, *before pushing them upstream*, is to configure `pre-commit`. Currently all hooks except `prospector` should pass. In other words you should be able to commit using the following command:

`env SKIP=prospector git commit -a`

## Pull requests

When a branch is ready for review we open a pull-request on github, requesting to merge our branch to devel branch. Here’s how we push a new branch:

```
git pull --rebase origin/devel
git push -u origin TX-8739-fix-crashing-homepage
```

The requirements for a PR to be merged are:
- The PR title should contain the ticket number, e.g. “TX-8739 Fix crashing homepage”
- Proper labels have been applied (see below)
- At least one reviewer is assigned and the reviewer has approved the pull request (following the recommended checklist and definition of “Done”)
- The branch is properly rebased on top of devel
- There are tests covering the new or altered code
- Tests have passed on CircleCI

Given that the above conditions are met, then either the reviewer or the requester of the pull request can merge it.

*There are cases where we open a pull request so that many people can work together and have clear diff on the changes. In that case a “WIP” label should be applied.*

Label guide:
- WIP: Work in progress, works like DNM
- bug: The PR is a bug fix
- Mayhem!: The PR is EPIC, use for fun to denote excitement!
- enhancement: The PR is a new feature (optional label)

## Code review

Code reviews are equally important to writing the code itself, so they should never be taken lightly. The reviewer is NEVER the person writing the code.

### General guidelines

#### Test the changes to make sure they work

Both authors and reviewers need to **TEST** the PR’s branch and make sure it indeed fixes the problem in hand and behaves as expected.

Though it may seem obvious, it is not. Seriously, please **RUN** the code you are building or reviewing. Test corner cases. Try to break it. Sometimes unit tests are not enough, so do some manual testing.

### For authors

#### Do a self-review first

Respect the reviewer’s time and do a self-review on github. A self review might reveal:

- Linting errors
- Copywriting typos
- Uncommented code
- Local files that were commited by mistake
- Debugging code (e.g. console.log, ipdb etc)
- Untested code or failing tests

#### Provide necessary information to reviewers

When a pull request is created, we have set up github on various of our repositories to create an empty description message with a default structure, that will help the reviewer do the review more efficiently.

The author of the PR needs to make sure that all necessary information is provided in the message. This information will be useful both to the reviewer as well as anyone that might view the PR in the future. In particular, it should describe what the PR is trying to solve, what the implemented solution is, how anyone can reproduce the issue, and also give additional details that could make the issue easier to understand.

The text here should be as descriptive and clear as possible. Pay extra attention in case of big, complex or critical PRs.

```
Related to TX-XXXX: Paste ticket's title here (and link)

Problem and/or solution
-----------------------
Provide as much information as you seem fit, so that readers can easily understand what was changed (at least on a high level) without reading all the file changes.

How to test
-----------
Describe how the reviewer can reproduce the previous behavior and how to test the fix.
```

### For reviewers

#### The reviewer’s checklist

The pull request description also contains a checklist. This is meant to be completed by the reviewer.

Any items that are not applicable for a particular PR should be denoted as N/A. The rest will be considered as applicable, and must all be checked in order for the PR to be approved. If one or more of the items is not checked, the reviewer should ask for changes. If the reviewer identifies that items marked as N/A are to be considered in the review, then he/she can either modify the description and enable the item and leave a comment to the author or ask the author to update the description explaining the reasoning behind the decision.

```
Reviewer checklist
------------------

For the code:
* [ ] Change is covered by unit-tests
* [ ] Code is well documented, well styled and is following best practices (cf. TEM)
* [ ] Performance issues have been taken under consideration
* [ ] Errors and other edge-cases are handled properly

For the PR:
* [ ] Problem and/or solution are well-explained
* [ ] Commits have been squashed so that each one has a clear purpose
* [ ] Commits have a proper commit message (according to TEM)
```

#### Reviewing release deployment PRs

Release PRs came about as a side-effect of us enabling branch protection on the master branch (which requires a reviewed PR). However they also can serve other purposes.

A release PR requires an approval by someone who is up-to date with any release plans that the team has and should be able to say that there is nothing blocking the deployment of already reviewed and approved changes.

For example, if the team decides to merge a PR onto devel but for some reason it shouldn’t be deployed immediately (perhaps some manual work must be done? Perhaps it’s Friday?) then the release PR reviewer should be the one to say “hang on, we can’t deploy this immediately. We should wait until X happens”, where X could mean e.g. “it’s now Monday morning”.

In that case, the reviewer should not approve the PR, the deployment should be cancelled and the PR should be closed.

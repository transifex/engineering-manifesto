---
title: Coding style
---

{% raw  %}
# Coding style

## General

We try to keep a consistent style across all our projects, although the rules may be different for each different type of file. E.g. Python files may follow slightly different rules than JS files. In any case, it is highly recommended to configure your work environment and your tools to perform automatic checks (and possibly automatic fixes as well). In the end of this section we mention the tools that are recommended.

### Source code encoding

In our projects we try to follow rules so that the encoding of our source code is consistent. The following rules should be followed across all types of source code files:

1. Use UTF-8 encoding
2. Use spaces, not tabs, to indent code
3. Use Unix-style line endings (single LF), not Windows (i.e. CRLF)
4. Do not leave trailing whitespace characters at each line (with the exception of the newline character).
5. Always leave a new-line character at the end of the file.

### Recommended tools (language agnostic)

#### editorconfig

Use this tool by using any text editor that natively supports [editorconfig](https://editorconfig.org), or a plugin exists that enables support for it. Make sure to configure your editor correctly so it reads the project’s .editorconfig file. Currently our config covers basic text formatting for Python, Javascript, HTML, CSS, LESS and YAML files.

#### pre-commit

Using [pre-commit](https://pre-commit.com) you can integrate a variety of different tools into your git workflow. This is important as it can help catch issues with commit quality. Currently our pre-commit config file checks a wide variety of files, including Python (style, syntax, and other errors), Javascript (style etc.), JSON and YAML.

## Python

### Source code encoding

1. Use 4 space characters for indenting Python code. Do not use tabs.
2. Every line should have a trailing newline character.
3. Use a single LF ending (i.e. no Windows-style line endings)
4. Use only UTF-8 encoding for python source code (and define it if supporting Python 2.7)

### Coding style

#### General

1. Follow [PEP-8](https://legacy.python.org/dev/peps/pep-0008/#maximum-line-length).
2. Always use absolute imports and keep your imports sorted (see Imports below).
3. Use docstrings to document every public attribute or method of a module or a class (see Docstrings below), including __init__.
4. Follow proper logging practices.
5. In Python 2.7, use unicode string literals and don’t mix encodings (see Unicode below).
6. Always write code compatible with py3k using the [six](https://pythonhosted.org/six/) module and following [these conventions](http://python-future.org/compatible_idioms.html).
7. Don't use bare `except:` clauses when doing exception handling. If you want to catch all exceptions that signal program errors, use `except Exception:` (bare except is equivalent to `except BaseException:`)

#### Strings

1. Use the `format` method for formatting strings, even when the parameters are all strings. Example:

```
# Like this
x = 'name: {}; score: {}'.format(name, n)

# Not like this
x = 'name: ' + name + '; score: ' + str(n)
```

2. Prefer `''.join` instead of `+` or `+=` to accumulate a string within a loop for better performance. Example:

```
# Like this
items = ['<table>']
for last_name, first_name in employee_list:
    items.append('<tr><td>%s, %s</td></tr>' % (last_name, first_name))
items.append('</table>')
employee_table = ''.join(items)

# Not like this
employee_table = '<table>'
for last_name, first_name in employee_list:
    employee_table += '<tr><td>%s, %s</td></tr>' % (last_name, first_name)
employee_table += '</table>'
```

3. Be consistent with your choice of string quote character within a file. Pick `'` or `"` and stick with it. It is okay to use the other quote character on a string to avoid the need to `\` escape within the string. Example:

```
# Like this
Python('Why are you hiding your eyes?')
Gollum("I'm scared of lint errors.")
Narrator('"Good!" thought a happy Python reviewer.')

# Not like this
Python("Why are you hiding your eyes?")
Gollum('The lint. It burns. It burns us.')
Gollum("Always the great lint. Watching. Watching.")
```

Prefer `"""` for multi-line strings rather than `'''`. Projects may choose to use `'''` for all non-docstring multi-line strings if and only if they also use `'` for regular strings. Docstrings must use `"""` regardless. Nevertheless, prefer implicit line joining since multi-line strings do not flow with the indentation of the rest of the program. Example:

```
# Like this
print ("This is much nicer.\n"
       "Do it this way.\n")

# Not like this
    print """This is pretty ugly.
Don't do this.
"""
```

### Security

Pay huge attention to issues regarding security, especially when handling user-provided data. Run your code through bandit to catch common mistakes.

#### Write raw SQL code responsibly

All raw SQL query strings should be defined inside `sql.py` files within the various django apps. This way, it will be simpler to inspect them if there is a security risk with one of them.

When doing raw SQL queries you should never format SQL directly in Python, not even with a gun to your head. If, by mistake, some of the text that makes it into the SQL query comes from an unreliable source, for example a form input or user-supplied contents from the database, it can render the syntax of the query invalid or, much worse, **damage the database permanently**.

The database adapter (psycopg) can handle many data types when formatting parameters:

```
# Never do this
cursor.execute(
    "SELECT * FROM foo WHERE id = {} AND name = '{}' AND JOINED > '{}'".
    format(1, 'name', datetime.now().isoformat())
)

# Instead, do this
cursor.execute(
    "SELECT * FROM foo WHERE id = %s AND name = %s AND JOINED > %s",
    (1, 'name', datetime.now())
)
```

You don't even have to supply the single-quotes, psycopg will figure them out from the parameters' type.

For data types that are not supported by psycopg by default, we can provide extensions [1].

If you **have** to supply a part of the query dynamically and it cannot be part of a parameter that psycopg can format (for example, a table name), use the [psycopg2.sql](http://initd.org/psycopg/docs/sql.html#module-psycopg2.sql) module's utilities:

```
model = random.choice([ModelA, ModelB, ModelC])

# Don't do this:
cursor.execute("SELECT * FROM {}".format(model._meta.db_table))

# Instead, do this:
from psycopg2 import sql
cursor.execute(sql.SQL("SELECT * FROM {}").
               format(sql.Identifier(model._meta.db_table)))
```

In fact, the query arguments to `cursor.execute()`, `Model.objects.raw()` and `Model.objects.extra()` should **never** be strings, but instances of `sql.SQL`.

### Imports

Prefer absolute imports. There is almost never a reason to use relative imports, but if you do have to use them, follow the guidelines at http://www.python.org/dev/peps/pep-0328/.

If you are supporting Python 2.7  add from `__future__` import absolute_import to the top of your file.

#### Import order

There is a specific order of imports:

1. `__future__`
2. Python standard library
3. Third party
4. Django
5. Transifex (including txdata, events, etc.)
6. Local to package folder (i.e. `from . import something`)

### Docstrings

Docstrings are an important part of the code we write, as they can help us significantly when trying to understand, debug and extend existing code. They should provide useful information, explaining what an object is about, and highlight all important aspects of that code. Useful docstrings do not just repeat whatever is in the name of the object they describe, but rather provide extra information.

Every attribute or method of a module or a class that is not marked as private should be documented using a docstring. Attributes and methods are private if their name starts with an underscore. Since Classes are attributes of the module in which they are defined, they should also always have a docstring when they are not marked private. Best practices for docstrings are outlined in [PEP 257](https://www.python.org/dev/peps/pep-0257/).

Note: the above does not mean that private attributes or methods should not have docstrings, only that the particular rule doesn’t apply to them. Other rules and conventions, such as those that are described in the section titled “Documentation” may apply.

In addition to these, arguments of public functions and methods should be documented in the docstring, along with what the function returns, as well as any exceptions it might raise. All docstrings should use the `reST field list`[2][3]  format. Type information, either via the `:type:` field, or inline in a `:param:` field, is optional (but encouraged).

The following example illustrates all points mentioned above:

```
def send_message(sender, recipient, message_body, priority=1):
    """Send a message to a recipient.

    If the message fails to be sent, it is automatically saved
    in the database as a draft.

    :param str sender: the sender’s username
    :param str recipient: the recipient’s username
    :param str message_body: the body of the message
    :param int priority: the priority of the message (1-5 or None)
    :return: the message id
    :rtype: int
    :raise ValueError: if `message_body` exceeds 160 characters
    :raise TypeError: if `message_body` is not a basestring
    """
```

### Unicode

When supporting Python 2.7 beware of issues regarding mixed string encodings. Always add `from __future__ import unicode_literals` to your imports.

### Recommended tools for Python

Most of the following are wrapped inside our pre-commit configuration, but here are the major tools we use:

#### flake8

For PEP-8 and basic syntax checking, install and use [flake8](http://flake8.pycqa.org/en/latest/), a code checker that wraps various checking tools, in particular pyflakes and pep8. Make sure the editor you use has a flake8 plugin installed, so that it automatically lints your code.

#### prospector

For in-depth checks of errors, potential problems, convention violations and complexity use [prospector](https://prospector.landscape.io/en/master/). This tool wraps a number of other tools, such as `pylint`.

Also, for PEP-257 checks use prospector with the `prospector-strict.yaml` profile.

#### isort

For sorting your imports use [isort](https://github.com/timothycrosley/isort). The tool is configured via the `editorconfig` configuration file.

#### bandit

Openstack’s [bandit](https://docs.openstack.org/bandit/latest/) will flag many security-related mistakes, see the documentation for the complete list of [tests](https://docs.openstack.org/bandit/latest/plugins/index.html#complete-test-plugin-listing) and [call](https://docs.openstack.org/bandit/latest/blacklists/blacklist_calls.html#module-bandit.blacklists.calls) or [import](https://docs.openstack.org/bandit/latest/blacklists/blacklist_imports.html#module-bandit.blacklists.imports) blacklists.

## JavaScript

### Install and use ESLint

At the root folder of your repo, there is an `.eslintrc` file that contains a set of rules for JavaScript code styling. Make sure that your editor of choice has an eslint plugin installed so that it automatically lints for errors while you code.

If you create a new repository that contains JavaScript, make sure that you copy-paste this file to the new repository as well.

Reference: https://eslint.org

Quick tips:
- Always use soft-tabs (spaces, not `\t`) with a two space indent
- Always use spaces after keywords, e.g. `if (x > 0)`
- Don't miss semicolons on purpose
- Do not leave spaces at the end of each line

#### Prefix JS-based selectors

Each time you need to access the DOM from JavaScript add a class selector in the form of `js-<name>` and never access directly tags or classes used by CSS.

Also avoid querying id and always access class. Example:

NOT LIKE THIS:

```
<ul id="js-world-id" class="o-list">
  <li  class="o-list__item">Hello</li>
  <li class="o-list__item">World</li>
</ul>

$('#js-world-id').addClass('is-disabled'); // ID
$('.o-list).addClass('is-disabled'); // CSS class
$('ul').addClass('is-disabled'); // Tag
```

LIKE THIS:

```
<ul class="o-list js-list">
  <li  class="o-list__item">Hello</li>
  <li class="o-list__item">World</li>
</ul>

$('.js-list').addClass('is-disabled');
```

### Prefer functional programming over for and while loops (optional)

In Transifex we make heavy use of http://underscorejs.org.

Learn about it and use it. It’s a powerful utilities library that makes your code look cleaner and not reinvent the wheel.

For example, Instead of using for or while loops you can use iterators:

```
var list = [1, 2, 3];
// INSTEAD OF THIS
for (var i = 0; i < list.length; i++) {
  console.log(list[i]);
}
// YOU CAN DO THIS
_.each(list, function(item) {
  console.log(item);
}, this);
```

### Group variable declarations together (optional)

To keep it short it's nice to do this:

```
var foo = 1,
    bar = foo,
    username,
    whateva = 'yo';
```

instead of:

```
var foo = 1;
var bar = foo;
var username;
var whateva = 'yo';
```

### Don’t pollute global namespace

Never write JavaScript code directly on the global scope. Always encapsulate it within a function to avoid pollution or leaking code.

```
(function() {
  var a;
  a = 1;
})();
```

When you create code for a view or Backbone/Marionette use a namespace to capture the functionality. `txbackbone.js` file contains a tool that helps you do that and allows various components and JavaScript files to communicate together. For example:

```
// popupview.js
(function() {
  var Views = Transifex.namespace('webhooks.views');
  Views.PopupView = ...
})();

// actionview.js
(function() {
  var Views = Transifex.namespace('webhooks.views');
  Views.ActionView = ...
})();
```

### Don’t rely on href='#'

Always prepend your event handlers with `event.preventDefault();` to avoid page redirection or replace # with javascript:;

NOT LIKE THIS:

```
<a href="#">Click me</a>
```

LIKE THIS:

```
<a href="javascript:;">Click me</a>
```

### Don’t worry about CSRF protection in AJAX POST

It is handled by a snippet included globally in base.js.

### Always use $.ajax instead of $.get or $.post

NOT LIKE THIS:

```
$.get(url, function(data) { … });
```

LIKE THIS:

```
$.ajax({
  url: url,
  type: 'GET',
  context: this, // ← NICE!
}).done(function(data) {
  ...
}).fail(function() {
  ...
}).always(function() {
  ...
});
```

Notice the context: `this`! This way you can access the caller’s this inside the `done`/`fail`/`always` promises.

### Don’t put JavaScript inside Django templates

Never put JavaScript blocks inside HTML, unless it used for transferring static data from Django template engine (see below).

Organize your project into its own folder or file inside `txc/static/js/`.

If you are creating a Marionette application use a folder structure like this:

```
transifex/static/js/<PROJECTNAME>/
├── app.js
├── collections.js
├── models.js
└── views
  ├── list.js
  └── upload.js
```

And then include the JS files inside your HTML:

```
{% compress js %}
  <script type="text/javascript" src="{% static "js/models.js" %}"></script>
  <script type="text/javascript" src="{% static "js/collections.js" %}"></script>
  <script type="text/javascript" src="{% static "js/views/list.js" %}"></script>
  <script type="text/javascript" src="{% static "js/views/upload.js" %}"></script>
  <script type="text/javascript" src="{% static "js/app.js" %}"></script>
{% endcompress %}
```

If you need to transfer data from Django, e.g. URL patterns or localized messages, then use one script block solely for that purpose, e.g.

```
<script type="text/javascript">
  (function() {
    var TemplateData = Transifex.namespace('webhooks.template_data');
    TemplateData.urls = {
      webhooks: '{% url "webhooks" project.organization.slug project.slug %}',
    };
    TemplateData.helpers = {
      event_types_list: JSON.parse('{{ event_types_list|escapejs }}'),
      event_types_dropdown: JSON.parse('{{ event_types_dropdown|escapejs }}'),
      proofread_id: {{ proofread_id }},
    };
    TemplateData.messages = {
      error: '{{ _("We are unable to contact our servers. Please try again.")|escapejs }}',
    };
  })();
</script>
```

### Beware of XSS security holes

When you print to HTML beware of XSS attacks. Always escape your output.

If you use underscore templates, use `<%- .. %>` instead of `<%= .. %>` to print a variables.

For example:

```
<script type="text/template">
  <!-- NOT LIKE THIS -->
  Hello <%= username %>

  <!-- LIKE THIS -->
  Hello <%- username %>
</script>
```

If you print using Django beware of escaping text what will be used by JavaScript. For example:

```
<script type="text/javascript">
  // for primitives
  var userstring = '{{ user_string|escapejs }}';
  var integer = parseInt('{{ user_number|escapejs }}');

  // for complex objects, first serialize to JSON,
  // then deserialize in Javascript
  var userdata = JSON.parse('{{ user_json|escapejs }}');
</script>
```

### Docstrings

*TBD, e.g. JSDoc??*

## CSS

The only two rules we need to mention here are:

- Use two spaces soft tabs
- Don’t use IDs to style your content

Everything else will be taken care of by the CSS linter.

### Use a CSS Linter

In order to have LESS/CSS linting in your editor of choice, you need to install any plugin that supports the stylelint linter (http://stylelint.io/). This will read the `.stylelintrc` file in the project's root folder and output any issues with the CSS code.

### Use comments

Use comments as long as it makes sense. We always use line comments in our files (//) and document any browser specific hack.

### Use BEM naming convention

We use the BEM (Block-Element-Modifier) naming convention with an addition of prefixes to make more clear what type of class we are using, any piece of code that isn't legacy is going to follow this methodology.

In case you are not familiar with BEM, please check out these resources:

https://getbem.com/introduction/

https://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/

https://csswizardry.com/2015/08/bemit-taking-the-bem-naming-convention-a-step-further/

Each time you need to create a new class, please remember that our naming conventions are not literal but functional. For example, we don’t have a class `.u-color-blue` but a class that is called `.u-color-primary` or `.u-color-cta` which reflect the way we use them and not their color.


## LESS

### File Structure

The basic folder structure of the system we are using is this. Anything that is outside of these folders is legacy code.

```
static
  └── less
      ├── components
      ├── config
      ├── helpers
      ├── manifest
      ├── objects
      ├── pages
      ├── shame
      └── utilities
```

Apart from legacy code, no `*.less` files should be included in the Django css imports but inside the manifest files.

### Use variables, don’t hardcode values

No values should be hardcoded in files but a variable should be used instead. For example, if we need to set a width that isn’t available through utilities, we use the `@baseline-grid` (6px) as base and multiply it.

```
.some-class {
  width: @baseline-grid
}
```

In case we need to set a new variable we create a new variable inside the /config folder in the file that is relevant to this variable, the value of this variable should be inherited by an already defined core variable we have inside the core/config folder. If there is no similar value we need to added.

**Important**: All the `config/core/` folder content is built after great thought and communication with each team member. No values should be added or removed without the 'talk' with other front end team members.

## HTML

BEM is a great way to remove complexity from CSS but it's moved into our HTML markup. We have some rules/recommendations about this.

### Order of classes

We use a specific order of classes in our HTML markup:
- Components
- Objects
- Utilities
- States
- JS-handlers

Example:

```
<div class="c-tooltip__content o-text-small u-color-secondary is-active js-tooltip">
  …
</div>
```

### Beware of Classitis

If you can do something with a smaller number of classes, do it.

Example:

Use `class="u-paddingVertical-2x"` instead of `class="u-paddingTop-2x u-paddingBottom-2x"`

## SQL

### Respect the 79-char limit

Some of us will be splitting our editor in panes to review many files at the same time. It's very frustrating when lines wrap.

### Big and descriptive table aliases

No more

```
SELECT p.name
FROM projects_project p
-- ...
```

Use Project instead. If the table implements a Django model, use the model's name. In long JOINs or WHERE/GROUP BY clauses, nested queries etc, it's incredibly difficult to remember which alias refers to which table otherwise.

### All SQL-reserved words in capital letters

This will help the eye distinct between user-supplied values (literals, table/field names, etc) from SQL-reserved words which makes everyone's lives better.

### Indentation on SELECT

If things don't fit into a single line, do this:

```
SELECT ATable.a_field,
       ATable.another_field AS mitsos,
       AnotherTable.a_field AS vangelis,
       COUNT(AnotherTable.antother_field)
```

1. First field in the same line as SELECT
2. Next fields all go in their own lines, aligned with the first field

If there are many short-named fields and this approach can turn the SELECT part span way too many lines, we can concede to having many fields in the same line,

eg.

```
SELECT source_string, context, source_lang_code, string, lang_code,
       string_hash, project_id, resource_id, source_entity_id,
       translation_id, username, creation_date, created, is_new,
       leverage, wordcount, origin, source_string_hash, identifier,
       organization_id,
       (is_new AND LEFT(origin, 3) = 'MT:')
```

but in general, it's easier to spot things if each field is in its own line.

### Indentation on FROM

```
FROM resources_reviewhistory ReviewHistory
    INNER JOIN projects_project Project
        ON Project.id = ReviewHistory.project_id
    INNER JOIN translations_language Language
        ON Language.id = Project.source_language_id
```

One indentation level for each JOIN. Another for each ON. Joins are the most important piece of the query when you're trying to figure out what it's looking for. This makes it very easy to figure out what's going on.

### Indentation on WHERE, GROUP BY

```
WHERE ReviewHistory.created BETWEEN %s and %s AND
      ReviewHistory.action='R' AND
      NOT (ReviewHistory.lang_code IS NULL OR
           ReviewHistory.resource_id IS NULL)
GROUP BY ReviewHistory.project_id,
         ReviewHistory.resource_id,
         ReviewHistory.lang_code,
         ReviewHistory.username,
         TO_DATE(ReviewHistory.created::TEXT, 'YYYY-MM-DD')
```

Same principles as with SELECT. Little extra note about WHERE, the boolean operators (AND or OR) should be at the end of the lines. This way, it's easier for you to isolate each part of the conditional.

### Example of putting this all together

Before:

```
SELECT
  rh.project_id,
  rh.resource_id,
  rh.lang_code,
  rh.username,
  (array_agg(l.code))[1] as source_lang_code,
  to_date(rh.created::text,'YYYY-MM-DD') as created,
  count(rh.id) as reviewed
FROM resources_reviewhistory rh
INNER JOIN projects_project p ON (p.id = rh.project_id)
INNER JOIN translations_language l ON (l.id = p.source_language_id)
WHERE rh.created BETWEEN %s and %s
    AND rh.action='R'
    AND NOT (rh.lang_code IS NULL OR rh.resource_id IS NULL)
GROUP BY rh.project_id, rh.resource_id, rh.lang_code, rh.username,
    to_date(rh.created::text,'YYYY-MM-DD')
```

After:

```
SELECT ReviewHistory.project_id,
       ReviewHistory.resource_id,
       ReviewHistory.lang_code,
       ReviewHistory.username,
       (ARRAY_AGG(SourceLanguage.code))[1] AS source_lang_code,
       TO_DATE(ReviewHistory.created::text, 'YYYY-MM-DD') AS created,
       COUNT(ReviewHistory.id) AS reviewed
FROM resources_reviewhistory ReviewHistory
    INNER JOIN projects_project Project
        ON Project.id = ReviewHistory.project_id
    INNER JOIN translations_language SourceLanguage
        ON SourceLanguage.id = Project.source_language_id
WHERE ReviewHistory.created BETWEEN %s AND %s AND
      ReviewHistory.action='R' AND
      NOT (ReviewHistory.lang_code IS NULL OR
           ReviewHistory.resource_id IS NULL)
GROUP BY ReviewHistory.project_id,
         ReviewHistory.resource_id,
         ReviewHistory.lang_code,
         ReviewHistory.username,
         TO_DATE(ReviewHistory.created::TEXT, 'YYYY-MM-DD')
```

## Ansible

*TBD*

----

[1] http://initd.org/psycopg/docs/advanced.html#adapting-new-python-types-to-sql-syntax

[2] http://www.sphinx-doc.org/en/master/usage/restructuredtext/domains.html#info-field-lists

[3]  http://docutils.sourceforge.net/docs/ref/rst/restructuredtext.html#field-lists

{% endraw %}

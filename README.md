Simple and yet reasonable Angular.js application featuring case study of ajax form validation.

Additionally my intention is to use this little project as a laboratory of best practices including testing, development environment, IDE tricks.

Unit Testing
------------

###Karma

Karma is test runner used by Angular team. Nice thing is that Jetbrain IDEs has a pluging for Karma.

Personally, I stumbled upon several issues this Karma and IDE plugin:

*   Karma server launched in terminal is in conflict with IDE saving files mechanism. Sometimes Karma is unable to react to update in file.

*   IDE plugin currently has bad support for file watch functionality. It does not react to file change, instead it reruns tests on stop typing event after 10s delay.

###Testem

You can use Testum test runner instead of Karma or alongside. Specify config file `testem.json` and you are done. Just run `testem` command in console and this will launch testing server that reruns tests on file change.


Integration testing
-------------------

Protractor is a recommended tool.

Styling
-------

Starting from version 5 Zurb Foundation framework is distributed as Bower component. In Compass config file insert this and you are done:

```
add_import_path "./static/bower_components/foundation/scss"
```

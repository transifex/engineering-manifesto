# Privacy considerations

Take into account privacy regulations (e.g. GDPR) in design and review of code. Personal data requires special handling in order to comply with regulations and to respect the rights of data subjects (i.e.the persons that the data refers to). Personal data is any kind of data that can be used alone, or in combination with other data, to identify a physical person. For example the following types of data are classified as personal data:

- a person's name
- an email
- a username
- an IP address

If you are dealing with data that relates to users and you are not sure if they should be classified as personal data raise the issue to management so that the risk of non-compliance is reduced.

Some practical tips:

- Use user_id instead of username for relating an object with a user. It is easier to anonymize in case of user deletion.
- Integrating with a third party service should reassure that when a user account is deleted/deactivated, relevant data is also removed from the third party service as well in an automated way.
- User consent is required for storing personal data explaining the reasoning of collection as well.
- When we build a new feature we should question whether part of that feature should be available in case users requests export of their data.

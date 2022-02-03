### Problem

At the moment people data within the organisation is not stored in a well-organised way and members of the organisation do not have access to it. This makes it hard for members to do things like:

- Find how who their colleagues are
- Work out who to go to for help with particular problems
- See who else is working in their region

### User Story

1. As a member of the organisation, I would like to see member data in one place.

2. As a developer, I would like to be able to access member data in order to build digital tools.

### Acceptance Criteria

1. The data should be stored in a JavaScript array/object
2. The data should be store in a logical format

### Attachments

I'm still waiting for complete data from HR but they've given me this sample dataset which you can use for the time being. We can update it later.

```csv
first name ,last name ,job title         ,department  ,manager  ,location  ,first aider ,user slack ,timezone
John       ,Doe       ,Software Engineer ,Engineering ,null     ,Glasgow   ,No          ,johndoe    ,America/Los_Angeles
Jane       ,Doe       ,Software Engineer ,Engineering ,John Doe ,Leeds     ,No          ,janedoe    ,America/Los_Angeles
Bob        ,Doe       ,Software Engineer ,Engineering ,Jane Doe ,Cape Town ,No          ,bobdoe     ,America/Los_Angeles
Sally      ,Doe       ,Software Engineer ,Engineering ,Jane Doe ,Rome      ,No          ,sallydoe   ,America/Los_Angeles
```

SET NOCOUNT ON;
SELECT 'INSERT INTO "AspNetUserTokens" ("UserId","LoginProvider","Name","Value") VALUES ('+
       ''''+REPLACE(UserId,'''','''''')+''''+','+
       ''''+REPLACE(LoginProvider,'''','''''')+''''+','+
       ''''+REPLACE(Name,'''','''''')+''''+','+
       CASE WHEN Value IS NULL THEN 'NULL' ELSE ''''+REPLACE(Value,'''','''''')+'''' END+');'
FROM dbo.AspNetUserTokens;

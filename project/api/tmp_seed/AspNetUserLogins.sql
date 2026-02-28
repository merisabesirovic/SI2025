SET NOCOUNT ON;
SELECT 'INSERT INTO "AspNetUserLogins" ("LoginProvider","ProviderKey","ProviderDisplayName","UserId") VALUES ('+
       ''''+REPLACE(LoginProvider,'''','''''')+''''+','+
       ''''+REPLACE(ProviderKey,'''','''''')+''''+','+
       CASE WHEN ProviderDisplayName IS NULL THEN 'NULL' ELSE ''''+REPLACE(ProviderDisplayName,'''','''''')+'''' END+','+
       ''''+REPLACE(UserId,'''','''''')+''''+');'
FROM dbo.AspNetUserLogins;

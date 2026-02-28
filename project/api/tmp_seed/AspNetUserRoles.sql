SET NOCOUNT ON;
SELECT 'INSERT INTO "AspNetUserRoles" ("UserId","RoleId") VALUES ('+
       ''''+REPLACE(UserId,'''','''''')+''''+','+
       ''''+REPLACE(RoleId,'''','''''')+''''+');'
FROM dbo.AspNetUserRoles;

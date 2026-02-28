SET NOCOUNT ON;
SELECT 'INSERT INTO "AspNetRoleClaims" ("Id","ClaimType","ClaimValue","RoleId") VALUES ('+
       CAST(Id AS varchar(20))+','+
       CASE WHEN ClaimType IS NULL THEN 'NULL' ELSE ''''+REPLACE(ClaimType,'''','''''')+'''' END+','+
       CASE WHEN ClaimValue IS NULL THEN 'NULL' ELSE ''''+REPLACE(ClaimValue,'''','''''')+'''' END+','+
       ''''+REPLACE(RoleId,'''','''''')+''''+');'
FROM dbo.AspNetRoleClaims;

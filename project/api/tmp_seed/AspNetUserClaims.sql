SET NOCOUNT ON;
SELECT 'INSERT INTO "AspNetUserClaims" ("Id","ClaimType","ClaimValue","UserId") VALUES ('+
       CAST(Id AS varchar(20))+','+
       CASE WHEN ClaimType IS NULL THEN 'NULL' ELSE ''''+REPLACE(ClaimType,'''','''''')+'''' END+','+
       CASE WHEN ClaimValue IS NULL THEN 'NULL' ELSE ''''+REPLACE(ClaimValue,'''','''''')+'''' END+','+
       ''''+REPLACE(UserId,'''','''''')+''''+');'
FROM dbo.AspNetUserClaims;

SET NOCOUNT ON;
SELECT 'INSERT INTO "AspNetUsers" ("Id","AccessFailedCount","ConcurrencyStamp","Email","EmailConfirmed","IsApproved","LockoutEnabled","LockoutEnd","NormalizedEmail","NormalizedUserName","PasswordHash","PhoneNumber","PhoneNumberConfirmed","SecurityStamp","TwoFactorEnabled","UserName") VALUES ('+
       CASE WHEN Id IS NULL THEN 'NULL' ELSE ''''+REPLACE(Id,'''','''''')+'''' END+','+
       CAST(AccessFailedCount AS varchar(20))+','+
       CASE WHEN ConcurrencyStamp IS NULL THEN 'NULL' ELSE ''''+REPLACE(ConcurrencyStamp,'''','''''')+'''' END+','+
       CASE WHEN Email IS NULL THEN 'NULL' ELSE ''''+REPLACE(Email,'''','''''')+'''' END+','+
       CASE WHEN EmailConfirmed=1 THEN 'true' ELSE 'false' END+','+
       CASE WHEN IsApproved=1 THEN 'true' ELSE 'false' END+','+
       CASE WHEN LockoutEnabled=1 THEN 'true' ELSE 'false' END+','+
       CASE WHEN LockoutEnd IS NULL THEN 'NULL' ELSE ''''+CONVERT(varchar(40),LockoutEnd,127)+'''' END+','+
       CASE WHEN NormalizedEmail IS NULL THEN 'NULL' ELSE ''''+REPLACE(NormalizedEmail,'''','''''')+'''' END+','+
       CASE WHEN NormalizedUserName IS NULL THEN 'NULL' ELSE ''''+REPLACE(NormalizedUserName,'''','''''')+'''' END+','+
       CASE WHEN PasswordHash IS NULL THEN 'NULL' ELSE ''''+REPLACE(PasswordHash,'''','''''')+'''' END+','+
       CASE WHEN PhoneNumber IS NULL THEN 'NULL' ELSE ''''+REPLACE(PhoneNumber,'''','''''')+'''' END+','+
       CASE WHEN PhoneNumberConfirmed=1 THEN 'true' ELSE 'false' END+','+
       CASE WHEN SecurityStamp IS NULL THEN 'NULL' ELSE ''''+REPLACE(SecurityStamp,'''','''''')+'''' END+','+
       CASE WHEN TwoFactorEnabled=1 THEN 'true' ELSE 'false' END+','+
       CASE WHEN UserName IS NULL THEN 'NULL' ELSE ''''+REPLACE(UserName,'''','''''')+'''' END+');'
FROM dbo.AspNetUsers;

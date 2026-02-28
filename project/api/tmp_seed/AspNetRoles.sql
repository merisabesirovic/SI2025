SET NOCOUNT ON;
SELECT 'INSERT INTO "AspNetRoles" ("Id","ConcurrencyStamp","Name","NormalizedName") VALUES ('+
       CASE WHEN Id IS NULL THEN 'NULL' ELSE ''''+REPLACE(Id,'''','''''')+'''' END+','+
       CASE WHEN ConcurrencyStamp IS NULL THEN 'NULL' ELSE ''''+REPLACE(ConcurrencyStamp,'''','''''')+'''' END+','+
       CASE WHEN Name IS NULL THEN 'NULL' ELSE ''''+REPLACE(Name,'''','''''')+'''' END+','+
       CASE WHEN NormalizedName IS NULL THEN 'NULL' ELSE ''''+REPLACE(NormalizedName,'''','''''')+'''' END+');'
FROM dbo.AspNetRoles;

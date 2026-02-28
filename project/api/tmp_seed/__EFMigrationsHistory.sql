SET NOCOUNT ON;
SELECT 'INSERT INTO "__EFMigrationsHistory" ("MigrationId","ProductVersion") VALUES ('+
       ''''+REPLACE(MigrationId,'''','''''')+''''+','+
       ''''+REPLACE(ProductVersion,'''','''''')+''''+');'
FROM dbo.__EFMigrationsHistory;

SET NOCOUNT ON;
SELECT 'INSERT INTO "Portfolios" ("UserId","TouristAttractionId") VALUES ('+
       ''''+REPLACE(UserId,'''','''''')+''''+','+
       CAST(TouristAttractionId AS varchar(20))+');'
FROM dbo.Portfolios;

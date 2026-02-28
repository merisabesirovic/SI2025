SET NOCOUNT ON;
SELECT 'INSERT INTO "Reviews" ("Id","Comment","CreatedOn","Rating","TouristAttractionId","UserId") VALUES ('+
       CAST(Id AS varchar(20))+','+
       ''''+REPLACE(Comment,'''','''''')+''''+','+
       ''''+CONVERT(varchar(40),CreatedOn,127)+''''+','+
       CAST(Rating AS varchar(20))+','+
       CASE WHEN TouristAttractionId IS NULL THEN 'NULL' ELSE CAST(TouristAttractionId AS varchar(20)) END+','+
       ''''+REPLACE(UserId,'''','''''')+''''+');'
FROM dbo.Reviews;

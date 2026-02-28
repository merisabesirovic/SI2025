SET NOCOUNT ON;
SELECT 'INSERT INTO "TouristAttractions" ("Id","Category","Description","Latitude","Longitude","Name","OwnerId","Photos","ViewCount") VALUES ('+
       CAST(Id AS varchar(20))+','+
       ''''+REPLACE(Category,'''','''''')+''''+','+
       ''''+REPLACE(Description,'''','''''')+''''+','+
       ''''+REPLACE(Latitude,'''','''''')+''''+','+
       ''''+REPLACE(Longitude,'''','''''')+''''+','+
       ''''+REPLACE(Name,'''','''''')+''''+','+
       CASE WHEN OwnerId IS NULL THEN 'NULL' ELSE ''''+REPLACE(OwnerId,'''','''''')+'''' END+','+
       ''''+REPLACE(Photos,'''','''''')+''''+','+
       CAST(ViewCount AS varchar(20))+');'
FROM dbo.TouristAttractions;

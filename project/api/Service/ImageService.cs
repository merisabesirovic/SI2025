using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

public class ImageService
{
    private readonly Cloudinary _cloudinary;

    public ImageService(Cloudinary cloudinary)
    {
        _cloudinary = cloudinary;
    }

    public async Task<List<string>> UploadImagesAsync(
        IEnumerable<IFormFile> files,
        int attractionId)
    {
        var urls = new List<string>();

        foreach (var file in files)
        {
            if (file.Length == 0) continue;

            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, file.OpenReadStream()),
                Folder = $"tourist_attractions/{attractionId}"
            };

            var result = await _cloudinary.UploadAsync(uploadParams);
            urls.Add(result.SecureUrl.ToString());
        }

        return urls;
    }

    public async Task DeleteImagesAsync(IEnumerable<string> imageUrls)
    {
        foreach (var url in imageUrls)
        {
            var publicId = ExtractPublicId(url);
            if (publicId != null)
            {
                await _cloudinary.DestroyAsync(new DeletionParams(publicId));
            }
        }
    }

    private string? ExtractPublicId(string url)
    {
        // https://res.cloudinary.com/xxx/image/upload/v123/folder/name.jpg
        var uri = new Uri(url);
        var parts = uri.AbsolutePath.Split("/upload/");
        if (parts.Length < 2) return null;

        var publicId = parts[1];
        return publicId.Substring(0, publicId.LastIndexOf('.'));
    }
}

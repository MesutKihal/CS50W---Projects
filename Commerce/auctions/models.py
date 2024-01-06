from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=64, unique=True)
    email = models.CharField(max_length=64)
    password = models.CharField(max_length=64)

class Category(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    class Meta:
        verbose_name_plural = "Categories"
    def __str__(self):
        return self.name

class AuctionListings(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=64, unique=True)
    description = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, related_name="listings",on_delete = models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to = "", default="empty.png")
    category = models.ForeignKey(Category, related_name="listings", on_delete = models.CASCADE, blank=True, null=True)
    search_fields = ["title", "description", "price", "category"]
    class Meta:
        verbose_name_plural = "Auction Listings"
    def __str__(self):
        return self.title
        
class Watchlist(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

class WatchlistItem(models.Model):
    id = models.AutoField(primary_key=True)
    watchlist = models.ForeignKey(Watchlist, on_delete=models.CASCADE)
    item = models.ForeignKey(AuctionListings, on_delete=models.CASCADE)
    
class Bid(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    n = models.IntegerField(default=0)
    listing = models.ForeignKey(AuctionListings, on_delete=models.CASCADE)
    value = models.IntegerField(default=0)
    
class Comment(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, related_name="comments", on_delete = models.CASCADE)
    listing = models.ForeignKey(AuctionListings, on_delete=models.CASCADE)
    text = models.TextField()
   
class ClosedAuction(models.Model):
    id = models.AutoField(primary_key=True)
    winner = models.OneToOneField(User, on_delete=models.CASCADE)
    owner = models.ForeignKey(User, related_name="closedauctions", on_delete=models.CASCADE)
    item = models.ForeignKey(AuctionListings, on_delete=models.CASCADE)
    
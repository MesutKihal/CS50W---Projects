from django.contrib import admin
from .models import Category, AuctionListings, Comment, Bid, User, Watchlist, WatchlistItem, ClosedAuction

# Register your models here.

admin.site.register(Category)
admin.site.register(AuctionListings)
admin.site.register(Comment)
admin.site.register(Bid)
admin.site.register(User)
admin.site.register(Watchlist)
admin.site.register(WatchlistItem)
admin.site.register(ClosedAuction)
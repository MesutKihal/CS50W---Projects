from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse
from django.contrib import messages
from .models import User, AuctionListings, Category, Comment, Bid, Watchlist, WatchlistItem, ClosedAuction
from django.contrib.auth.decorators import login_required

def index(request):
    listings = AuctionListings.objects.filter(is_active=True)
    bids = Bid.objects.all()
    if request.user.is_authenticated:
        closed_auctions = ClosedAuction.objects.filter(winner=request.user)
    else:
        closed_auctions = None
    return render(request, "auctions/index.html", {"listings": listings,
                                             "bids": bids,
                                             "closed_auctions": closed_auctions})
@login_required
def watchlist(request):
    watchlist = Watchlist.objects.filter(user=request.user)
    listings = [listing.item for listing in WatchlistItem.objects.filter(watchlist__in=watchlist)]
    bids = Bid.objects.all()
    if request.method == "POST":
        list_id = request.POST["list_id"]
        item = AuctionListings.objects.get(id=list_id)
        WatchlistItem.objects.filter(watchlist__in=watchlist, item=item).delete()
        messages.success(request, "Item removed from watchlist")
        return redirect("watchlist")
    return render(request, "auctions/watchlist.html", {"listings": listings,
                                                 "bids": bids})

@login_required
def categories(request):
    category = request.GET.get("category", "")
    listings = AuctionListings.objects.filter(is_active=True)
    categories = Category.objects.all()
    bids = Bid.objects.all()
    if category:
        listings = AuctionListings.objects.filter(is_active=True, category=category)
    return render(request, "auctions/categories.html", {"categories": categories,
                                                  "listings": listings,
                                                  "bids": bids})
@login_required
def listing(request, pk):
    item = AuctionListings.objects.get(id=pk)
    if request.user.is_authenticated:
        watchlist = Watchlist.objects.filter(user=request.user)
    else:
        watchlist = None
    comments = Comment.objects.filter(listing=item)
    listing_bid = Bid.objects.get(listing=item)
    if not item.is_active:
        closed_auction = ClosedAuction.objects.get(item = item)
    else:
        closed_auction = None
    if request.user.is_authenticated:
        watchlist_trigger = request.GET.get("watchlist", "")
        deactivate_trigger = request.GET.get("deactivate", "")
        if watchlist_trigger:
            watchlist_ = Watchlist.objects.get(user=request.user)
            if not WatchlistItem.objects.filter(watchlist__in=watchlist, item=item):
                watchlist_item = WatchlistItem.objects.create(watchlist=watchlist_, item=item)
                messages.success(request, "Item added to watchlist")
            else:
                messages.info(request, "Item already added to watchlist")
            return redirect(reverse("listing", args=[pk]))
        if deactivate_trigger:
            last_bidder = Bid.objects.get(listing=item).user
            winner = ClosedAuction.objects.create(winner = last_bidder, owner = request.user, item = item)
            AuctionListings.objects.filter(id=pk).update(is_active=False)
            return redirect(reverse("listing", args=[pk]))
        if request.method == "POST":
            try:
                cmt = request.POST["cmt"]
            except:
                cmt = ""
            try:
                mybid = request.POST["mybid"]
            except:
                mybid = ""
            if cmt:
                cmt = request.POST["cmt"]
                comment = Comment(user=request.user, listing=item, text=cmt)
                comment.save()
            if mybid and item.created_by != request.user:
                if int(mybid) > listing_bid.value:
                    new_n = int(Bid.objects.get(listing=item).n) + 1
                    Bid.objects.filter(listing=item).update(user=request.user, value=int(mybid), n = new_n)
                    listing_bid = Bid.objects.get(listing=item)
                    return redirect(reverse("listing", args=[pk]))
                else:
                    messages.error(request, "Bid has to be higher then the previous one.")
                    return redirect(reverse("listing", args=[pk]))
    return render(request, "auctions/listing.html", {"listing": item,
                                               "comments": comments,
                                               "bid": listing_bid,
                                               "closed_auction": closed_auction})

@login_required
def create(request):
    categories = Category.objects.all()
    if request.method == "POST":
        title = request.POST["title"]
        desc = request.POST["desc"]
        bid = request.POST["st-bid"]
        cate = request.POST["cate"]
        img = request.FILES["img"]
        if not title:
            messages.error(request, "Title not provided")
            return redirect("create")
        listing = AuctionListings(title=title, description=desc, image=img, created_by=request.user)
        if not bid or bid.isalpha():
            mybid = Bid(user=request.user, listing=listing, value = 0)
        else:
            mybid = Bid(user=request.user, listing=listing, value = bid)
        listing.save()
        mybid.save()
        messages.success(request, "Item created successfully")
        return redirect("create")
    return render(request, "auctions/create.html", {"categories": categories})

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            messages.success(request, "Logged In successfully")
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
            watchlist = Watchlist.objects.create(user=user)
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        messages.success(request, "Logged In successfully")
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")

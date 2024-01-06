from django import forms


class CreateEntry(forms.Form):
    title = forms.CharField(label="", widget=forms.Textarea(attrs={'class': 'form-control', 'rows': '1'}))
    markdown = forms.CharField(label="", widget=forms.Textarea(attrs={'class': 'form-control', 'rows': '10'}))

class EditEntry(forms.Form):
    title = forms.CharField(label="", widget=forms.Textarea(attrs={'class': 'form-control', 'rows': '1'}))
    markdown = forms.CharField(label="", widget=forms.Textarea(attrs={'class': 'form-control', 'rows': '10'}))

from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'CourseComment.views.home', name='home'),
    # url(r'^CourseComment/', include('CourseComment.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
    url(r'^', include('login.urls')),
    url(r'^gossip/', include('gossip.urls')),
    url(r'^lecture/', include('lecture.urls')),
    url(r'^search/', include('search.urls')),
    url(r'^userpage/', include('userpage.urls')),
    url(r'^comment/', include('comment.urls')),
    url(r'^cadmin/', include('cadmin.urls')),
    url(r'^managedb/', include('manageDB.urls')),
)

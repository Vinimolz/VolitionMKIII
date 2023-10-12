from django.urls import path
from base.views import order_views as views

urlpatterns = [
    path('', views.get_all_orders, name='admin_all_orders'),
    path('add/', views.add_order_items, name='orders_add'),
    path('myorders/', views.get_all_orders_by_id, name='all_orders'),
    path('<str:pk>/deliver/', views.update_order_to_delivered, name='order_delivered_update'),
    path('<str:pk>/', views.get_order_by_id, name='user_order'),
    path('<str:pk>/pay/', views.update_order_to_paid, name='order_paid_update'),
]
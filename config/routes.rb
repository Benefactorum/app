Rails.application.routes.draw do
  get "connexion", to: "user#connection", as: :connection
  post "user/create_or_find"
  namespace :sessions do
    resource :passwordless, only: [ :new, :edit, :create ]
  end
  get "se-connecter", to: "sessions#new", as: :sign_in
  post "se-connecter", to: "sessions#create"
  get  "s-inscrire", to: "registrations#new", as: :sign_up
  post "s-inscrire", to: "registrations#create"
  resources :sessions, only: [ :index, :show, :destroy ]
  resource  :password, only: [ :edit, :update ]
  namespace :identity do
    resource :email,              only: [ :edit, :update ]
    resource :email_verification, only: [ :show, :create ]
    resource :password_reset,     only: [ :new, :edit, :create, :update ]
  end
  get "auth", to: "home#index"
  root "pages#home"
  resources :posts

  get "inertia-example", to: "inertia_example#index"

  get "qui-nous-sommes", to: "pages#about_us"
  get "co-fondateurs", to: "pages#cofounders"
  get "nous-rejoindre", to: "pages#join_us"
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
end

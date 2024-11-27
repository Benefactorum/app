Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  get "connexion", to: "connections#new", as: :new_connection
  resources :connections, only: [:create] do
    collection do
      post :resend_otp
    end
  end

  get "s-inscrire", to: "registrations#new", as: :new_registration
  resources :registrations, only: [:create]

  get "se-connecter", to: "sessions#new", as: :new_session
  resources :sessions, only: [:create, :destroy]

  get "utilisateurs/:id", to: "users#show", as: :user
  resources :users, only: [:update] do
    resource :profile_picture, only: [:update, :destroy]
  end

  # resource  :password, only: [ :edit, :update ]
  # namespace :identity do
  #   resource :email,              only: [ :edit, :update ]
  #   resource :email_verification, only: [ :show, :create ]
  #   resource :password_reset,     only: [ :new, :edit, :create, :update ]
  # end

  root "pages#home"

  get "inertia-example", to: "inertia_example#index"

  get "qui-nous-sommes", to: "pages#about_us"
  get "co-fondateurs", to: "pages#cofounders"
  get "nous-rejoindre", to: "pages#join_us"

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  # is used by Kamal Deploy
  get "up" => "rails/health#show", :as => :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
end

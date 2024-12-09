Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Authentication Routes
  get "connexion", to: "connections#new", as: :new_connection
  resources :connections, only: [:create] do
    post :resend_otp, on: :collection
  end
  get "s-inscrire", to: "registrations#new", as: :new_registration
  resources :registrations, only: [:create]
  get "se-connecter", to: "sessions#new", as: :new_session
  resources :sessions, only: [:create, :destroy]

  # User Profile and Contributions
  get "utilisateurs/:id", to: "users#show", as: :user
  get "mon-profil", to: "users#show", as: :my_profile
  resources :users, only: [:update] do
    resource :profile_picture, only: [:update, :destroy], module: :users
    resources :contributions, shallow: true, module: :users
  end
  get "mes-contributions", to: "users/contributions#index", as: :my_contributions
  get "mes-contributions/ajouter-une-association", to: "users/contributions#new", as: :my_new_contribution

  # resource  :password, only: [ :edit, :update ]
  # namespace :identity do
  #   resource :email,              only: [ :edit, :update ]
  #   resource :email_verification, only: [ :show, :create ]
  #   resource :password_reset,     only: [ :new, :edit, :create, :update ]
  # end

  # Static Pages
  root "pages#home"
  get "inertia-example", to: "inertia_example#index"
  get "qui-nous-sommes", to: "pages#about_us", as: :about_us
  get "co-fondateurs", to: "pages#cofounders", as: :cofounders
  get "nous-rejoindre", to: "pages#join_us", as: :join_us

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  # is used by Kamal Deploy
  get "up", to: "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
end

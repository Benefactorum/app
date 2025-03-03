Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Authentication Routes
  scope module: "auth" do
    get "connexion", to: "connections#new", as: :new_connection
    resource :connection, only: [:create]
    resource :otp, only: [:create]
    get "s-inscrire", to: "registrations#new", as: :new_registration
    resource :registration, only: [:create]
    get "se-connecter", to: "sessions#new", as: :new_session
    resources :sessions, only: [:create, :destroy]
  end

  # User Profile and Contributions
  get "utilisateurs/:id", to: "users#show", as: :user
  get "mon-profil", to: "users#show", as: :my_profile
  resources :users, only: [:update] do
    resource :profile_picture, only: [:update, :destroy], module: :users
    resources :contributions, only: [:create, :show, :update, :destroy], module: :users
  end
  get "mes-contributions", to: "users/contributions#index", as: :my_contributions
  get "mes-contributions/ajouter-une-association", to: "users/contributions#new", as: :my_new_contribution
  get "mes-contributions/:id/modifier", to: "users/contributions#edit", as: :edit_my_contribution
  get "mes-contributions/:id", to: "users/contributions#show", as: :my_contribution

  resources :osbl_imports, only: [:create, :show]

  resources :keywords, only: [:index, :create]
  resources :intervention_areas, only: [:index, :create]
  # resource  :password, only: [ :edit, :update ]
  # namespace :identity do
  #   resource :email,              only: [ :edit, :update ]
  #   resource :email_verification, only: [ :show, :create ]
  #   resource :password_reset,     only: [ :new, :edit, :create, :update ]
  # end

  # Static Pages
  root "pages#home"
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

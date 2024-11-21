class PagesController < ApplicationController
  skip_before_action :require_authentication

  def home
    render inertia: "Pages/Home"
  end

  def about_us
    render inertia: "Pages/AboutUs"
  end

  def cofounders
    render inertia: "Pages/Cofounders"
  end

  def join_us
    render inertia: "Pages/JoinUs"
  end
end

class PagesController < ApplicationController
  def home
    render inertia: "Pages/Home"
  end

  def about_us
    render inertia: "Pages/AboutUs"
  end

    def cofounders
    render inertia: "Pages/Cofounders"
  end
end

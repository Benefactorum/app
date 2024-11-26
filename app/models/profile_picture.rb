class ProfilePicture
  include ActiveModel::Model
  include ActiveModel::Attributes

  attribute :profile_picture

  validates :profile_picture, presence: true

  def attach_to(user)
    return false unless valid?

    user.profile_picture.attach(profile_picture)
    if user.save
      true
    else
      errors.merge!(user.errors)
      false
    end
  end
end

module Contributions
  class CreateService
    def initialize(user:, params:)
      @user = user
      @params = params
    end

    def call
      osbl_params = @params.delete(:osbl)
      contribution = @user.contributions.build(@params)
      osbl = Osbl.new(osbl_params)

      return [:error, osbl.errors] unless osbl.valid?

      osbl_data = OsblDataTransformer.new(osbl_params).transform
      contribution.contributable = Contribution::OsblCreation.new(osbl_data: osbl_data)

      contribution.save!
      [:ok, "Votre contribution a été enregistrée."]
    end
  end
end

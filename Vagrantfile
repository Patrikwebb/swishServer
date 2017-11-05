# Vagrant.configure("2") do |config|
#   config.vm.box = "debian/jessie64"
#   config.vm.network "private_network", ip: "10.0.0.2"
#   #config.vm.network "private_network", ip: "192.168.0.2"
# end


#############################
#                           #
#   With Ansbile PlayBook   #
#                           #
#############################

Vagrant.configure(2) do |config|
  config.vm.box = "debian/jessie64"
  config.vm.network "private_network", ip: "10.0.0.2"
  #config.vm.network "private_network", ip: "192.168.0.2"
  config.vm.provision :ansible do |ansible|
    ansible.playbook = "playbook.yml"

  end

end
